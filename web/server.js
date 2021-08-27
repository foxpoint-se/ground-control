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

const isValidPosition = (obj) => {
  return obj.lat && obj.lon
}

nextApp.prepare().then(() => {
  const app = express()
  app.use(express.json())
  const server = http.createServer(app)
  const io = new socketio.Server()

  app.get('/hello', async (_, res) => {
    res.send('hello')
  })

  app.post('/positions', async (req, res) => {
    console.log(req.body)
    if (!isValidPosition(req.body)) {
      res.status(400)
    }
    state.positions.push(req.body)
    io.emit('NEW_POSITION', { position: req.body })
    res.json({})
  })

  io.attach(server)

  io.on('connection', (socket) => {
    console.log('someone connected')

    socket.emit('ALL_POSITIONS', { positions: state.positions })

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
