const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const next = require('next')

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const state = {
  positions: [],
}

nextApp.prepare().then(() => {
  const app = express()
  const server = http.createServer(app)
  const io = new socketio.Server()

  app.get('/hello', async (_, res) => {
    res.send('hello')
  })

  io.attach(server)

  io.on('connection', (socket) => {
    console.log('someone connected')

    io.emit('hello', { hej: 'hej' })

    socket.emit('hehe', 'state')

    socket.on('stuff', (payload) => {
      console.log('hej')
    })

    socket.on('disconnect', () => {
      console.log('someone disconnected')
    })
  })

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`)
  })
})
