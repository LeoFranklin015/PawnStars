// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract UniversalKYC {

    // Mapping to track user verification status
    mapping(address => bool) public userVerified;
    
    // Mapping to store user proof (merkle root, or other relevant proof)
    mapping(address => bytes32) public userProof;
    mapping(address => string) public userName;

    // Event to log when a user is verified
    event USERVERIFIED(address indexed user, bytes32 proof, string name);

    // Function to verify a user's KYC and store the proof
    function verifyUser(address _user, bytes32 _proof, string memory _name) public {
        // Update the user's verification status
        userVerified[_user] = true;
        
        // Store the user's proof
        userProof[_user] = _proof;

        // Emit an event to log the verification action
        emit USERVERIFIED(_user, _proof, _name);
    }
    
    // Function to check if a user is verified
    function isUserVerified(address _user) public view returns (bool) {
        // Return the verification status of the user
        return userVerified[_user];
    }

    function getUserProof(address _user) public view returns (bytes32) {
        return userProof[_user];
    }

    function getUserName(address _user) public view returns (string memory) {
        return userName[_user];
    }
}
