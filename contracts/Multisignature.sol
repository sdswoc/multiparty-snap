// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract MultipartyPayments {
    
string public orgName;
address public orgWallet;
uint stakesInFavour = 0;
uint requiredMajority;


mapping (address => bool) public stakeHolderVoted;

mapping (address => shareHolder) internal addressToStakeholder; // maps the address to the stakeholder
event NewStakeHolder (string name, uint stake); // notify when a new stakeholder is added
event PaymentInitiated (address stakeAddress, uint amount); // notify when a payment is initialised

event PaymentReceived (address senderAddress, uint amountSent);
event PaymentSuccessful (uint amount, address payable sendTo);
event PaymentUnsuccessful ();

shareHolder[] private inFavour;
paymentDetails[] private allTransactions;

struct shareHolder { // shareholders with the respective stakes
    string name;
    uint stakes;
}

struct paymentDetails { // detials regarding a payment
    uint amount;
    address initiatedBy;
    address payable sendToAddress;
    bool status;
}

constructor (string memory _name, uint _requiredMajority, address payable _orgWallet) { // sets the organization name and majority mark along with the wallet address

    orgName = _name;
    requiredMajority = _requiredMajority;
    orgWallet = _orgWallet;
}

function addStakeHolder (string memory _name, uint _stake, address _stakeAddress) public { // adds stakeholders

    require(msg.sender == orgWallet);
    addressToStakeholder[_stakeAddress] = shareHolder(_name, _stake);
    emit NewStakeHolder (_name, _stake);
}


function voteForPayment (bool _inFavour) public {

require(addressToStakeholder[msg.sender].stakes > 0); // verifying that the person is a stakeHolder of the company 
require(stakeHolderVoted[msg.sender] == false); // verifying that the stakeholder has not casted his vote
if (_inFavour){
        string memory _name = addressToStakeholder[msg.sender].name;
        uint _stake = addressToStakeholder[msg.sender].stakes;
        inFavour.push(shareHolder(_name, _stake));
    
    
    for (uint i = 0; i < inFavour.length; i++){
        stakesInFavour += inFavour[i].stakes;
    }
    stakeHolderVoted[msg.sender] = true; // mark the stakeHolder as voted
}

else {
    stakeHolderVoted[msg.sender] = true;
}


}

function paymentToAddress (uint _amount, address payable _sendTo) public payable {

emit PaymentInitiated (msg.sender, _amount);
require(addressToStakeholder[msg.sender].stakes > 0);

require(address(this).balance >= _amount, "Insufficient balance for the transaction to occur.");

if (stakesInFavour >= requiredMajority){

uint TransferAmount = _amount;
(_sendTo).transfer(TransferAmount);

emit PaymentSuccessful(_amount, _sendTo);

paymentDetails memory Payment = paymentDetails(_amount, msg.sender, _sendTo, true);
allTransactions.push(Payment);

}

else {
    emit PaymentUnsuccessful();
}
// stakesInFavour = 0;
// for (uint i = 0; i < inFavour.length; i++){
// inFavour.pop();
// }
}

function transactionHistory () public view returns(paymentDetails [] memory){
    return allTransactions;
}

receive() payable external {
    emit PaymentReceived (msg.sender, msg.value);
}

}