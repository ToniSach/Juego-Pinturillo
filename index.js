const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var PORT = process.env.PORT || 3000
let points = [];

io.on('connection', function(socket){
    console.log('Un usuario nuevo se ha conectado');

    socket.on('draw', (message) => {
        
        points.push(message)
        io.emit('draw', message)
    })

    socket.on('clear', () => {
        points = []

        io.emit('clear')
    })

    socket.on('chat', message => {
        io.emit('chat',message)
    })
});

app.use(express.static('public'))

app.get('/points', (req, res) => {
    res.send(points)
})

http.listen(PORT, () => console.log(`¡servidor corriendo en el puerto ${PORT}!`))