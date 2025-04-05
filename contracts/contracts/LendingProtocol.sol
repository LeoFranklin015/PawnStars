// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RWA.sol";

contract LendingProtocol is Ownable {
    // Contract addresses
    RWA public immutable rwaToken;
    IERC20 public immutable usdcToken;
    
    // Constants
    uint256 public constant LTV_RATIO = 60; // 60% LTV
    uint256 public constant BASIS_POINTS = 1000000000000000000;
    
    // Structs
    struct LoanRequest {
        address borrower;
        uint256 rwaId;
        uint256 valuation;
        bool isActive;
        bool isFilled;
        bool isAccepted;
    }
    
    struct Loan {
        address borrower;
        uint256 rwaId;
        uint256 amount;
        uint256 interestRate;
        uint256 startTime;
        uint256 dueTime;
        bool isActive;
    }
    
    // State variables
    mapping(uint256 => LoanRequest) public loanRequests;
    mapping(uint256 => Loan) public loans;
    uint256 public loanRequestCounter;
    uint256 public loanCounter;
    
    // Events
    event LoanRequested(address indexed borrower, uint256 indexed rwaId, uint256 amount, uint256 requestId, uint256 valuation);
    event ValuationProvided(uint256 indexed rwaId, uint256 indexed requestId, uint256 valuation);
    event LoanAccepted(uint256 indexed requestId, address indexed borrower, uint256 rwaId, uint256 amount, uint256 valuation);
    event LoanIssued(uint256 indexed loanId, address indexed borrower, uint256 rwaId, uint256 amount, uint256 interestRate, uint256 dueTime);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 rwaId, uint256 amount, uint256 interest);
    
    constructor(address _rwaToken, address _usdcToken) Ownable(msg.sender) {
        rwaToken = RWA(_rwaToken);
        usdcToken = IERC20(_usdcToken);
    }
    
    // Function to request a loan using RWA as collateral
    function requestLoan(uint256 _rwaId) external  {
        require(rwaToken.ownerOf(_rwaId) == msg.sender, "Not the RWA owner");
        
        loanRequests[loanRequestCounter] = LoanRequest({
            borrower: msg.sender,
            rwaId: _rwaId,
            valuation: 0,
            isActive: true,
            isFilled: false,
            isAccepted: false
        });
        
        emit LoanRequested(msg.sender, _rwaId, 0, loanRequestCounter, 0);
        loanRequestCounter++;
    }
    
    // Function for oracle to provide RWA valuation
    function provideValuation(uint256 _rwaId, uint256 _valuation) external onlyOwner {
        require(_valuation > 0, "Invalid valuation");
        
        // Find the active loan request for this RWA
        for (uint256 i = 0; i < loanRequestCounter; i++) {
            if (loanRequests[i].rwaId == _rwaId && loanRequests[i].isActive && !loanRequests[i].isFilled) {
                loanRequests[i].valuation = _valuation;
                emit ValuationProvided(_rwaId, i, _valuation);
                return;
            }
        }
        
        revert("No active loan request found for this RWA");
    }
    
    // Function for borrower to accept the loan offer
    function acceptLoan(uint256 _requestId) external  {
        LoanRequest storage request = loanRequests[_requestId];
        require(request.isActive, "Request is not active");
        require(!request.isFilled, "Request already filled");
        require(!request.isAccepted, "Request already accepted");
        require(request.borrower == msg.sender, "Not the request borrower");
        require(request.valuation > 0, "Valuation not provided");
        
        // Calculate loan amount based on LTV
        uint256 maxLoanAmount = (request.valuation * LTV_RATIO) / BASIS_POINTS;
        
        // Transfer RWA to contract (custody)
        rwaToken.transferFrom(msg.sender, address(this), request.rwaId);
        
        // Mark request as accepted
        request.isAccepted = true;
        
        emit LoanAccepted(_requestId, msg.sender, request.rwaId, maxLoanAmount, request.valuation);
    }
    
    // Function to issue a loan after acceptance
    function issueLoan(uint256 _requestId) external  {
        LoanRequest storage request = loanRequests[_requestId];
        require(request.isActive, "Request is not active");
        require(!request.isFilled, "Request already filled");
        require(request.isAccepted, "Request not accepted");
        
        // Create loan
        loans[loanCounter] = Loan({
            borrower: request.borrower,
            rwaId: request.rwaId,
            amount: request.valuation,
            interestRate: 500, // 5% annual interest rate (500 basis points)
            startTime: block.timestamp,
            dueTime: block.timestamp + 365 days, // 1 year term
            isActive: true
        });
        
        // Mark request as filled
        request.isFilled = true;
        
        // Transfer USDC to borrower
        require(usdcToken.transfer(request.borrower, request.valuation), "USDC transfer failed");
        
        emit LoanIssued(loanCounter, request.borrower, request.rwaId, request.valuation, 500, block.timestamp + 365 days);
        loanCounter++;
    }
    
    // Function to repay loan and reclaim RWA
    function repayLoan(uint256 _loanId) external  {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan is not active");
        require(loan.borrower == msg.sender, "Not the loan borrower");
        
        // Calculate repayment amount (principal + interest)
        uint256 timeElapsed = block.timestamp - loan.startTime;
        uint256 interest = (loan.amount * loan.interestRate * timeElapsed) / (365 days * BASIS_POINTS);
        uint256 repaymentAmount = loan.amount + interest;
        
        // Transfer USDC from borrower
        require(usdcToken.transferFrom(msg.sender, address(this), repaymentAmount), "USDC transfer failed");
        usdcToken.transfer(loan.borrower, interest);
        
        // Transfer RWA back to borrower
        rwaToken.transferFrom(address(this), msg.sender, loan.rwaId);
        
        // Mark loan as inactive
        loan.isActive = false;
        
        emit LoanRepaid(_loanId, msg.sender, loan.rwaId, loan.amount, interest);
    }
    
    // Function to get loan details
    function getLoanDetails(uint256 _loanId) external view returns (
        address borrower,
        uint256 rwaId,
        uint256 amount,
        uint256 interestRate,
        uint256 startTime,
        uint256 dueTime,
        bool isActive
    ) {
        Loan storage loan = loans[_loanId];
        return (
            loan.borrower,
            loan.rwaId,
            loan.amount,
            loan.interestRate,
            loan.startTime,
            loan.dueTime,
            loan.isActive
        );
    }
} 