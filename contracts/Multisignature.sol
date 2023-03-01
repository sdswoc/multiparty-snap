// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract MultipartyPayments {
    
string public orgName;
uint stakesInFavour = 0;
uint requiredMajority;

struct coFounder {
    string name;
    uint stakes;
    address coFounderAddress;
}


mapping (address => bool) public stakeHolderVoted;
mapping (address => shareHolder) internal addressToStakeholder; // maps the address to the stakeholder
mapping (address => coFounder) public addressToCoFounder;


event NewStakeHolder (string name, uint stake); // notify when a new stakeholder is added
event PaymentInitiated (address stakeAddress, uint amount); // notify when a payment is initialised
event PaymentReceived (address senderAddress, uint amountSent);
event PaymentSuccessful (uint amount, address payable sendTo);
event PaymentUnsuccessful ();

shareHolder[] private inFavour;
coFounder[] public coFounders;
coFounder[] private inFavourCoFounders;

struct shareHolder { // shareholders with the respective stakes
    string name;
    uint stakes;
}

constructor (string memory _name, uint _requiredMajority, coFounder [] memory _coFounders) { // sets the organization name and majority mark along with the wallet address

orgName = _name;
requiredMajority = _requiredMajority;

for (uint i = 0; i < _coFounders.length; i++){
    coFounders.push(_coFounders[i]);
    }

for (uint i = 0; i < _coFounders.length; i++){
    addressToCoFounder[_coFounders[i].coFounderAddress] = coFounders[i];
    }
    
}

function addStakeHolder (string memory _name, uint _stake, address _stakeHolderAddress) public { // adds stakeholders

require(addressToCoFounder[msg.sender].stakes > 0);
addressToStakeholder[_stakeHolderAddress] = shareHolder(_name, _stake);
emit NewStakeHolder (_name, _stake);
}


function voteForPayment (bool _inFavour) public {

require(addressToStakeholder[msg.sender].stakes > 0 || addressToCoFounder[msg.sender].stakes > 0); // verifying that the person is a stakeHolder of the company 
require(stakeHolderVoted[msg.sender] == false); // verifying that the stakeholder has not casted his vote
if (_inFavour){

    if (addressToStakeholder[msg.sender].stakes > 0){
        string memory _name = addressToStakeholder[msg.sender].name;
        uint _stake = addressToStakeholder[msg.sender].stakes;
        inFavour.push(shareHolder(_name, _stake));
    }
    else {
        string memory _name = addressToCoFounder[msg.sender].name;
        uint _stake = addressToCoFounder[msg.sender].stakes;
        inFavourCoFounders.push(coFounder(_name, _stake));

    }
    stakeHolderVoted[msg.sender] = true; // mark the stakeHolder as voted
}

else {
    stakeHolderVoted[msg.sender] = true;
}

}

function evaluateResults () public {
    for (uint i = 0; i < inFavour.length; i++){
        stakesInFavour += inFavour[i].stakes;
    }
    for (uint j = 0; j < inFavourCoFounders.length; j++){
        stakesInFavour += inFavourCoFounders[j].stakes;
    }
}


function paymentToAddress (uint _amount, address payable _sendTo) public payable {

emit PaymentInitiated (msg.sender, _amount);
require(addressToStakeholder[msg.sender].stakes > 0 || addressToCoFounder[msg.sender].stakes > 0);

require(address(this).balance >= _amount, "Insufficient balance for the transaction to occur.");

if (stakesInFavour >= requiredMajority){

uint TransferAmount = _amount;
(_sendTo).transfer(TransferAmount);

emit PaymentSuccessful(_amount, _sendTo);

}

else {
    emit PaymentUnsuccessful();
        }
    }
}