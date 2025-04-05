// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RWA is ERC721URIStorage, Ownable {
    uint256 public tokenIdCounter;
    address private issuer;

    event RWATokenIssued(uint256 indexed tokenId, address indexed owner, string tokenURI);

    // Constructor to set the name and symbol for the ERC721 token
    constructor() ERC721("RealWorldAsset", "RWA") Ownable(msg.sender) {}

    // Function to set the issuer address
    function setIssuer(address _issuer) external onlyOwner {
        issuer = _issuer;
    }

    // Modifier to restrict access to only the issuer
    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only the issuer can perform this action");
        _;
    }

    // Function to mint a new RWA token
    function mintRWA(address recipient, string memory _tokenURI) external onlyIssuer returns (uint256) {
        uint256 tokenId = tokenIdCounter;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        tokenIdCounter++;

        emit RWATokenIssued(tokenId, recipient, _tokenURI);
        return tokenId;
    }
}
