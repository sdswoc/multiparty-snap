// imports
import { ethers } from "../ethers-5.6.esm.min.js"
import { abi, contractAddress } from "../constants.js"
const socket = io('http://localhost:3000')

const connectButton = document.getElementById("connectBtn")
connectButton.onclick = connect;

const addStakeHolderButton = document.getElementById("addStakeHolderBtn")
addStakeHolderButton.onclick = addStakeHolder;

const initiatePaymentButton = document.getElementById("paymentsButton")
initiatePaymentButton.onclick = payments;

const activeAccount = document.getElementById("account")

async function connect() {
    if (typeof window.ethereum !== undefined){
        try {
        const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
        activeAccount.innerHTML = accounts[0]
        } catch (error) {
            console.log(error);
        }
        connectButton.innerHTML = "Connected"

    }
    else {
        connectButton.innerHTML = "Please install metamask"
    }
}

async function addStakeHolder() {

    const name = document.getElementById("name").value
    const stake = document.getElementById("stake").value
    const address = document.getElementById("address").value

    if (typeof window.ethereum !== undefined){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        
        try {
            console.log("Initialising...")
            const addedStakeHolder = await contract.addStakeHolder(name, stake, address)
            provider.once('NewStakeHolder', () => {
               
            })
            await listenForAddingStakeHolders(addedStakeHolder, provider)
            window.alert("Successfully added the StakeHolder to your organisation!")      

        }
        catch (error){
            console.log(error)
            console.log("Sorry, it seems like you do not have the rights to add new Stake Holders")
        }
    }
    else {
        console.log("Please Install Metamask!")
    }
}

async function payments(amount, address){

    if (typeof window.ethereum !== undefined){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)


    amount = ethers.utils.parseUnits(document.getElementById("amount").value, "ether");
    address = document.getElementById("sendTo").value;
    console.log(amount.toString());

    document.getElementById('paymentsButton').disabled = true;

    await contract.voteForPayment(true);
    
    console.log("Button disabled")
    socket.emit('paymentInitiated')

    console.log("Socket emitted")
    setTimeout(async ()=>{
    await contract.evaluateResults();
    
    console.log("Results evaluated");
    await console.log(contract.stakesInFavour().toString());

    // const transaction = await contract.paymentToAddress(amount, address);

    // const txReceipt = await signer.sendTransaction(transaction);
    // const txStatus = await provider.waitForTransaction(txReceipt.hash);
    // console.log(txStatus);

    const result = await contract.demoFunction();
    console.log(result.toString());
    window.alert("Congratulations, you have completed WoC!")

    document.getElementById('paymentsButton').disabled = false;
    },30000)
}

    else {
        console.log("Please install metamask!")
    }
}

socket.on('voteForPayment', async () => {
   
    console.log("Socket is working")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let message = `Test Message`

    const signature = await signer.signMessage(message)
    console.log(signature)
    
    await contract.voteForPayment(true)
    window.alert("You have voted in favour of the payment!")

})

function listenForAddingStakeHolders(addedStakeHolder, provider) {
    console.log(`Mining ${addedStakeHolder.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(addedStakeHolder.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}
