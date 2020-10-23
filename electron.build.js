const { loadNuxt, build } = require('nuxt')
const server = require('express')()
const electron = require('electron')
const path = require('path')
const url = require('url')

const http = require('http')

let win = null
// Import and Set Nuxt.js options
let config = require('./nuxt.config')
config.dev = !(process.env.NODE_ENV === 'production')

const isDev = process.env.NODE_ENV !== 'production'

console.log('xx', typeof electron)

// Get a ready to use Nuxt instance
loadNuxt(isDev ? 'dev' : 'start').then(nuxt => {
  if (isDev) {
    build(nuxt)
  }
  server.use(nuxt.render)
  server.listen(3000, '127.0.0.1')
  console.log('Server listening on localhost:3000')

  const POLL_INTERVAL = 300
  const pollServer = () => {
    http.get('http://localhost:3000', (res) => {
      const SERVER_DOWN = res.statusCode !== 200
      SERVER_DOWN ? setTimeout(pollServer, POLL_INTERVAL) : win.loadURL('http://localhost:3000')
    })
      .on('error', pollServer)
  }

  const app = electron.app
  const bw = electron.BrowserWindow

  const newWin = () => {
    win = new bw({ width: 1024, height: 768 })
    if (!config.dev) {
      return win.loadURL('http://localhost:3000')
    }
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
    win.on('closed', () => win = null)
    pollServer()
  }

  app.on('ready', newWin)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => win === null && newWin())
})
