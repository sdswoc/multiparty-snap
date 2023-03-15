var http = require("http")
var httpServer = http.createServer()
const io = require("socket.io")(httpServer, {
    cors: {
        origins: "http://localhost:5500/",
    },
})


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

httpServer.listen(3000)
