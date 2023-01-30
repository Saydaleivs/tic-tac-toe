const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  socket.on('joinRoom', (roomCode) => {
    let rooms = io.sockets.adapter.rooms
    let room = rooms.get(roomCode)

    if (room == undefined) {
      socket.join(roomCode)
    } else if (room.size == 1) {
      socket.join(roomCode)
      socket.broadcast.to(roomCode).emit('Who_is_first', true)
      socket.emit('joined')
    } else {
      socket.emit('full')
    }
  })

  socket.on('play', ({ id, roomCode, name, isReady, turn }) => {
    socket.broadcast.to(roomCode).emit('joined_user', name)
    socket.broadcast
      .to(roomCode)
      .emit('updateGame', { id, name, turn, isReady })
  })
})

const PORT = process.env.PORT || 8000
server.listen(PORT, () => console.log(`listening on port ${PORT}....`))
