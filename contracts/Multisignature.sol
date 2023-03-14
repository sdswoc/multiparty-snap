// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract Multisignature {
    string public orgName;
    uint public stakesInFavour = 0;
    uint public requiredMajority;

    struct coFounder {
        //cofounder has the rights to add a new stakeholder into the organisation
        string name;
        uint stakes;
        address coFounderAddress;
    }

    mapping(address => bool) public stakeHolderVoted; // mapped to true if voted
    mapping(address => shareHolder) public addressToStakeholder; // maps the address to the stakeholder
    mapping(address => coFounder) public addressToCoFounder; // maps the address to the cofounder

    event NewStakeHolder(string name, uint stake); // notify when a new stakeholder is added

    shareHolder[] public inFavour; // array with people in favour of the payment
    coFounder[] public coFounders;
    coFounder[] public inFavourCoFounders;
    shareHolder[] public shareHolders;

    struct shareHolder {
        // shareholders with the respective stakes
        string name;
        uint stakes;
        address shareHolderAddress;
    }

    constructor(
        string memory _name,
        uint _requiredMajority,
        coFounder[] memory _coFounders
    ) {
        // sets the organization name and majority mark along with array of struct of cofounders

        orgName = _name;
        requiredMajority = _requiredMajority;

        for (uint i = 0; i < _coFounders.length; i++) {
            coFounders.push(_coFounders[i]);
        }

        for (uint i = 0; i < _coFounders.length; i++) {
            addressToCoFounder[_coFounders[i].coFounderAddress] = _coFounders[
                i
            ];
        }
    }

    function addStakeHolder(
        string memory _name,
        uint _stake,
        address _stakeHolderAddress
    ) public {
        // adds stakeholders

        require(addressToCoFounder[msg.sender].stakes > 0);
        require(addressToStakeholder[_stakeHolderAddress].stakes == 0);
        addressToStakeholder[_stakeHolderAddress] = shareHolder(
            _name,
            _stake,
            _stakeHolderAddress
        );
        shareHolders.push(shareHolder(_name, _stake, _stakeHolderAddress));
        emit NewStakeHolder(_name, _stake); // let the front end know that a new stake holder is added
    }

    function voteForPayment(bool _inFavour) public {
        require(
            addressToStakeholder[msg.sender].stakes > 0 ||
                addressToCoFounder[msg.sender].stakes > 0
        ); // verifying that the person is a stakeHolder or a cofounder
        require(stakeHolderVoted[msg.sender] == false); // verifying that the stakeholder has not casted his vote
        if (_inFavour) {
            if (addressToStakeholder[msg.sender].stakes > 0) {
                string memory _name = addressToStakeholder[msg.sender].name;
                uint _stake = addressToStakeholder[msg.sender].stakes;
                inFavour.push(shareHolder(_name, _stake, msg.sender));
            } else if (addressToCoFounder[msg.sender].stakes > 0) {
                string memory _name = addressToCoFounder[msg.sender].name;
                uint _stake = addressToCoFounder[msg.sender].stakes;
                inFavourCoFounders.push(coFounder(_name, _stake, msg.sender));
            }
            stakeHolderVoted[msg.sender] = true; // mark the stakeHolder as voted
        } else {
            stakeHolderVoted[msg.sender] = true;
        }
    }

    function evaluateResults() public {
        uint tempA = 0;
        uint tempB = 0;
        for (uint i = 0; i < inFavour.length; i++) {
            tempA += inFavour[i].stakes;
        }
        for (uint j = 0; j < inFavourCoFounders.length; j++) {
            tempB += inFavourCoFounders[j].stakes;
        }
        stakesInFavour = tempA + tempB;
    }

    function reset() public {
        for (uint i = 0; i < inFavourCoFounders.length; i++) {
            delete stakeHolderVoted[inFavourCoFounders[i].coFounderAddress];
        }
        for (uint j = 0; j < inFavour.length; j++) {
            delete stakeHolderVoted[inFavour[j].shareHolderAddress];
        }
        while (inFavourCoFounders.length > 0) {
            inFavourCoFounders.pop();
        }
        while (inFavour.length > 0) {
            inFavour.pop();
        }
        stakesInFavour = 0;
    }

    receive() external payable {}
}
