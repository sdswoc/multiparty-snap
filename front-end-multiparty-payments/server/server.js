const io = require("socket.io")(3000)

io.on("connection", (socket) => {
    socket.on("paymentInitiated", () => {
        socket.broadcast.emit("voteForPayment")
    })

    socket.on("paymentSuccessful", () => {
        socket.broadcast.emit("alertSuccessful")
    })

    socket.on("paymentUnsuccessful", () => {
        socket.broadcast.emit("alertUnsuccessful")
    })
})
