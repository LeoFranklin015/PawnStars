// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./RWA.sol";
import "./UniversalKYC.sol";
contract Issuer {
    address public owner;
    address public rwaContractAddress;
    uint256 public requestCounter;

    // Interface to interact with RWAContract
    RWA public rwaContract;
    UniversalKYC public universalKYC;

    // Struct to store RWA request details
    struct RWARequest {
        address requester;  // Who is requesting the RWA token
        string productName;
        string imageHash;
        uint256 yearsOfUsage;
        bool isApproved;
        bool isIssued;
        string documentHash;
    }

    mapping(uint256 => RWARequest) public rwaRequests;

    event RWARequestCreated(uint256 indexed requestId, address indexed requester, uint256 yearsOfUsage, string productName, string imageHash, string documentHash);
    event RWAApproved(uint256 indexed requestId, address indexed requester, string productName, string productModel, string documentHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyKYCVerified() {
        require(universalKYC.isUserVerified(msg.sender), "User must be KYC verified");
        _;
    }

    constructor(address _rwaContractAddress , address _universalKYCAddress) {
        owner = msg.sender;
        rwaContractAddress = _rwaContractAddress;
        rwaContract = RWA(_rwaContractAddress);
        universalKYC = UniversalKYC(_universalKYCAddress);
    }

    // Function to allow users to request RWA creation
    function requestRWA(string memory _productName , string memory _imageHash, uint256 _yearsOfUsage , string memory _documentHash) external onlyKYCVerified {
        requestCounter++;
        rwaRequests[requestCounter] = RWARequest({
            requester: msg.sender,
            productName: _productName,
            imageHash: _imageHash,
            yearsOfUsage: _yearsOfUsage,
            isApproved: false,
            isIssued: false,
            documentHash:_documentHash
        });

        emit RWARequestCreated(requestCounter, msg.sender , _yearsOfUsage , _productName , _imageHash , _documentHash);
    }

    // Function for the owner to approve the RWA request and set the price
    function approveRWA(uint256 requestId) external onlyOwner {
        RWARequest storage rwaRequest = rwaRequests[requestId];
        require(!rwaRequest.isApproved, "RWA already approved");
        require(!rwaRequest.isIssued, "RWA already issued");

        rwaRequest.isApproved = true;
        rwaRequest.isIssued = true;
        rwaContract.mintRWA(rwaRequest.requester, rwaRequest.documentHash);

        emit RWAApproved(requestId, rwaRequest.requester, rwaRequest.productName, rwaRequest.imageHash, rwaRequest.documentHash);

    }

}
