const io = require("socket.io")(3000)

io.on("connection", (socket) => {
    socket.on("paymentInitiated", () => {
        socket.broadcast.emit("voteForPayment")
    })

    socket.on("paymentSuccessful", () => {
        io.emit("alertSuccessful")
    })

    socket.on("paymentUnsuccessful", () => {
        io.emit("alertUnsuccessful")
    })
})
