const { loadNuxt, build } = require('nuxt')
const server = require('express')()
const electron = require('electron')
const path = require('path')
const url = require('url')

const http = require('http')

// Import and Set Nuxt.js options
const config = require('./nuxt.config')
const isDev = process.env.NODE_ENV !== 'production'

const port = 31337
let win = null

const servurl = 'http://localhost:' + port
const genurl = url.format({
  pathname: path.join(__dirname, 'dist/index.html'),
  protocol: 'file:',
  slashes: true
})

const app = electron.app
const bw = electron.BrowserWindow

// Get a ready to use Nuxt instance
loadNuxt(isDev ? 'dev' : 'start').then(nuxt => {
  if (isDev) {
    config.dev = true
    build(nuxt)
  }
  server.use(nuxt.render)
  server.listen(port, '127.0.0.1')
  console.log('Server listening on ' + servurl)

  const POLL_INTERVAL = 300
  const pollServer = () => {
    http.get(servurl, (res) => {
      const SERVER_DOWN = res.statusCode !== 200
      SERVER_DOWN ?
        setTimeout(pollServer, POLL_INTERVAL) :
        win.loadURL(genurl)
    })
      .on('error', pollServer)
  }

  const newWin = () => {
    win = new bw({
      frame: false,
      titleBarStyle: 'hiddenInset',
      width: 1024,
      height: 768,
      webPreferences: {
        webSecurity: false
      }
    })
    // if (isDev) {
    //   return win.loadURL(servurl)
    // }
    // win.loadURL(genurl)
    // win.on('closed', () => win = null)
    // pollServer()
    win.loadFile('dist/index.html')
  }

  app.on('ready', newWin)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => win === null && newWin())
})
