const io = require('socket.io')(3000)

io.on('connection', socket => {
    socket.on('paymentInitiated', () => {
        socket.broadcast.emit('voteForPayment')
    })
})
