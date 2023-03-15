// imports
import { ethers } from "../ethers-5.6.esm.min.js"
import { abi, contractAddress } from "../constants.js"
const socket = io("http://localhost:3000")

const connectButton = document.getElementById("connectBtn")
connectButton.onclick = connect

const addShareHolderButton = document.getElementById("addShareHolderBtn")
addShareHolderButton.onclick = addStakeHolder

const initiatePaymentButton = document.getElementById("paymentsBtn")
initiatePaymentButton.onclick = payments

const activeAccount = document.getElementById("account")

async function connect() {
    if (typeof window.ethereum !== undefined) {
        try {
            const accounts = await window.ethereum.request({
                // Connecting user's MetaMask to the dApp
                method: "eth_requestAccounts",
            })
            activeAccount.innerHTML = `Connected Account: ${accounts[0]}`
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "Please install metamask"
    }
}

async function addStakeHolder() {
    const name = document.getElementById("floatingName").value
    const stake = document.getElementById("floatingShare").value
    const address = document.getElementById("floatingAddress").value

    if (typeof window.ethereum !== undefined) {
        // Checks if the user has MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer) // Creates an instance of the contract

        try {
            ethers.utils.getAddress(address) // Verify the address
            console.log("Initialising...")
            const addedStakeHolder = await contract.addStakeHolder(
                name,
                stake,
                address
            )
            provider.once("NewStakeHolder", () => {})
            await listenForAddingStakeHolders(addedStakeHolder, provider)
            window.alert(
                "Successfully added the StakeHolder to your organisation!"
            )
        } catch (error) {
            console.log(error)
            console.log(
                "Sorry, it seems like you do not have the rights to add new Stake Holders"
            )
        }
    } else {
        console.log("Please Install Metamask!")
    }
    document.getElementById("floatingName").value = ""
    document.getElementById("floatingShare").value = ""
    document.getElementById("floatingAddress").value = ""
}

async function payments(amount, address) {
    if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        amount = ethers.utils.parseEther(
            document.getElementById("floatingAmount").value
        )
        address = document.getElementById("floatingSendTo").value
        console.log(amount.toString())
        ethers.utils.getAddress(address) // Verify if the entered address is correct

        document.getElementById("paymentsBtn").disabled = true

        try {
            const coFounderVoted = await contract.voteForPayment(true)
            await coFounderVoted.wait(1) // Waits for the transaction to be mined
        } catch (error) {
            console.log(error)
        }

        console.log("Button disabled")
        socket.emit("paymentInitiated")

        console.log("Socket emitted")
        setTimeout(async () => {
            const resultsEvaluated = await contract.evaluateResults()
            await resultsEvaluated.wait(1)

            console.log("Results evaluated")
            const requiredMajority = await contract
                .requiredMajority()
                .toString()

            const stakesInFavour = await contract.stakesInFavour().toString()
            console.log(stakesInFavour)

            if (stakesInFavour >= requiredMajority) {
                try {
                    const tx = await signer.sendTransaction({
                        to: address,
                        value: amount,
                    })
                    tx.wait(1)
                    console.log(`tx: ${tx}`)
                    socket.emit("paymentSuccessful")
                } catch (error) {
                    console.log(error)
                    socket.emit("paymentUnsuccessful")
                }
            } else {
                socket.emit("paymentUnsuccessful")
            }
            document.getElementById("paymentsBtn").disabled = false

            document.getElementById("floatingAmount").value = ""
            document.getElementById("floatingSendTo").value = ""

            const reset = await contract.reset()
            await reset.wait(1)
        }, 30000) // A set time period is allowed for voting before we proceed
    } else {
        console.log("Please install metamask!")
    }
}

socket.on("voteForPayment", async () => {
    console.log("Socket is working")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    let message = `Do you approve of the initiated transaction?`

    try {
        const signature = await signer.signMessage(message)
        console.log(signature)

        const shareHolderVoted = await contract.voteForPayment(true)
        await shareHolderVoted.wait(1)
        window.alert("You have voted in favour of the payment!")
    } catch (error) {
        consosle.log(error)
    }
})

socket.on("alertSuccessful", async () => {
    console.log("Socket is working")
    window.alert("The transaction was completed successfully!")
})

socket.on("alertUnsuccessful", async () => {
    console.log("Socket is working")
    window.alert("Sorry, the transaction failed!")
})

function listenForAddingStakeHolders(addedStakeHolder, provider) { // Listens when a new ShareHolder is added
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
