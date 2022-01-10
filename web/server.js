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
  gpConnectionStatus: {},
}

nextApp.prepare().then(() => {
  const app = express()
  app.use(express.json())
  const server = http.createServer(app)
  const io = new socketio.Server()

  app.get('/command', async (req, res) => {
    const { query } = req
    const { value } = query
    if (value) {
      try {
        fetch(`http://localhost:5000/command?value=${value}`)
        res.json({})
      } catch (error) {
        res.status(504)
        res.json({ message: 'läsarsnurran svarar inte' })
      }
    } else {
      res.status(400)
      res.json({})
    }
  })

  app.get('/start', async (_, res) => {
    try {
      await fetch('http://localhost:5000/start')
      res.json({})
    } catch (error) {
      res.status(504)
      res.json({ message: 'läsarsnurran svarar inte' })
    }
  })

  app.get('/stop', async (_, res) => {
    try {
      await fetch('http://localhost:5000/stop')
      res.json({})
    } catch (error) {
      res.status(504)
      res.json({ message: 'läsarsnurran svarar inte' })
    }
  })

  app.post('/positions', async (req, res) => {
    state.positions.push(req.body)
    io.emit('NEW_POSITION', { position: req.body })
    res.json({})
  })

  app.post('/is_gp_connected', async (req, res) => {
    state.gpConnectionStatus = req.body
    io.emit('GP_CONNECTION_STATUS', req.body)
    res.json({})
  })

  app.post('/responses', async (req, res) => {
    io.emit('NEW_RESPONSE', { response: req.body })
    res.json({})
  })

  io.attach(server)

  io.on('connection', (socket) => {
    console.log(`${socket.id} connected`)

    socket.emit('ALL_POSITIONS', {
      positions: state.positions,
    })

    socket.on('CLEAR_POSITIONS', () => {
      state.positions = []
      io.emit('ALL_POSITIONS', {
        positions: state.positions,
      })
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`)
    })
  })

  app.all('*', (req, res) => nextHandler(req, res))

  server.listen(port, () => {
    console.log(`Server ready on http://localhost:${port}`)
  })
})
