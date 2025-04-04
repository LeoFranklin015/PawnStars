// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Formatter} from "@selfxyz/contracts/contracts/libraries/Formatter.sol";
import {CircuitAttributeHandler} from "@selfxyz/contracts/contracts/libraries/CircuitAttributeHandler.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

contract SelfHappyBirthday is SelfVerificationRoot, Ownable {


    mapping(uint256 => bool) internal _nullifiers;
    mapping(address => bool) internal _isVerified;
    mapping(address => string) internal _firstName;
    mapping(address => string) internal _lastName;
    event KYCVerified(address indexed user , string firstName , string lastName);

    error RegisteredNullifier();

    constructor(
        address _identityVerificationHub, 
        uint256 _scope, 
        uint256 _attestationId,
        address _token,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub, 
            _scope, 
            _attestationId, 
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        )
        Ownable(_msgSender())
    {
    }

    function verifySelfProof(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    )
        public
        override
    {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }

        // if (_nullifiers[proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_NULLIFIER_INDEX]]) {
        //     revert RegisteredNullifier();
        // }

        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub.verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );

        bytes memory charcodes = Formatter.fieldElementsToBytes(result.revealedDataPacked);
    
    // Extract the date of birth using CircuitAttributeHandler.
    // fist name: 0
    // last name: 1
        string[] memory name = CircuitAttributeHandler.getName(charcodes);
        string memory firstName = name[0];
        string memory lastName = name[1];
        _firstName[address(uint160(result.userIdentifier))] = firstName;
        _lastName[address(uint160(result.userIdentifier))] = lastName;

        _nullifiers[result.nullifier] = true;
        _isVerified[address(uint160(result.userIdentifier))] = true;
        emit KYCVerified(address(uint160(result.userIdentifier)), firstName, lastName);
    }

    function isVerified(address _user) public view returns (bool) {
        return _isVerified[_user];
    }

    function getFirstName(address _user) public view returns (string memory) {
        return _firstName[_user];
    }

    function getLastName(address _user) public view returns (string memory) {
        return _lastName[_user];
    }
}