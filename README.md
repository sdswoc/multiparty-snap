
# MultiParty Payments dApp

This is my project repository developed during SDSLabs Winter of Code 2023

## About
This is a dApp for multiparty transactions, i.e transactions in which more than one party is involved (particularly organisations) and aims at implementing this for organisations.
This was made using node.js, solidity (Hardhat development environemnt), bootstrap along with the use of MetaMask API.


## Features

* Simple and elegant UI and easy to interact and understand.
* Secure transactions on the blockchain.
* Processes multiparty transactions upon majority consensus after gaining user signatures.

## Relevance 

This dApp is built to extend the functionality of MetaMask in order to exxpand it to serve to multiparty transactions, the transactions in which many parties are involved and all don't necessarily have the same 'weight' for their opinion.


## Quick Start Guide

1. Clone the repository to your local machine using the command 
```bash
  git clone (SSH key)
```
in your terminal using the SSH key of the repository.

2. Install all the required dependencies using 
```bash
  npm install
```
in the root of the repository.

3. Install MetaMask browser extension : [Install MetaMask](https://metamask.io/download/).

4. Create a ``` .env ``` file and create a variable ``` PRIVATE_KEY``` and assign it the value of private key of a MetaMask wallet (It is recommended to not use an actual wallet, instead make a new wallet).

5. Deploy the contract on the Polygon Mumbai testnet by running the command ``` yarn hardhat run --network polygon_mumbai scripts/deploy.js ``` in the root of your directory.

6. Use [Polygon Faucet](https://faucet.polygon.technology) to get test MATIC cryptocurrrency by entering your wallet's address.

7. Change your directory by running ```cd front-end-multiparty-payments ``` and run the node server by running the command ``` node ./server/server.js ```.
Open ``` localhost:5500/front-end-multiparty-payments/```. Now you can interact with the dApp.

8. You may get an error while running the node server, you can fix that using [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en) Chrome extension.

## Description
You can add a new ShareHolder to the organisation by specifying their share, name and wallet address.

You can initiate a new transaction and notice that it will send signature requests to other ShareHolders which they can approve or disapprove, and if the total consensus is greater than 51%, the transaction will be successful (You need to have atleast two MetaMask wallet in diffefent browsers preferably!). Note that you can make multiple transactions after entering the relevant data of ShareHolders.

You can edit the relevant details like name of the organisation, required majority along with the data of CoFounders while deploying the contract in ```./scripts/deploy.js ```.

## Authors

[Saurabh Rana](https://github.com/Quebula17)

## Mentors 

- [Jainil Patel](https://github.com/jainl28patel)

- [Darshan Kumar](https://github.com/itsdarshankumar)

## License 

Licensed under the [MIT License](https://github.com/sdswoc/multiparty-snap/blob/main/LICENSE)