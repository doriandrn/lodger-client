const { loadNuxt, build } = require('nuxt')
const { app, BrowserWindow } = require('electron')
const serve = require('electron-serve');
const config = require('./nuxt.config')
const isDev = process.env.NODE_ENV !== 'production'

const loadURL = serve({ directory: 'dist' })

let win

// Get a ready to use Nuxt instance
loadNuxt(isDev ? 'dev' : 'start').then(nuxt => {
  if (isDev) {
    config.dev = true
    build(nuxt)
  }

  const newWin = () => {
    win = new BrowserWindow({
      frame: false,
      titleBarStyle: 'hiddenInset',
      width: 1024,
      height: 768,
      webPreferences: {
        webSecurity: false
      }
    })

    loadURL(win)
  }

  app.on('ready', newWin)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => win === null && newWin())
})
