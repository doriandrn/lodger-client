var path = require('path')
var webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

const stylusPlugins = [
  require('rupture')()
]

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'ui',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  mode: 'spa',
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  css: [{
    src: '~assets/styles/index.styl',
    lang: 'stylus'
  }],
  plugins: [{
    src: '~plugins/debug'
  },
  {
    src: '~plugins/validate'
  },
  {
    src: '~plugins/portal'
  },
  {
    src: '~plugins/range'
  },
  {
    src: '~plugins/i18n'
  }],
  vendor: [
    'moment'
  ],
  router: {
    linkActiveClass: 'active'
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        
      }

      // Extend aliases
      Object.assign(config.resolve.alias, {
        styles: resolve('assets/styles'),
        UI: resolve('components/UI'),
        widgets: resolve('components/widgets'),
        form: resolve('components/formElements'),
        forms: resolve('forms'),
        db: resolve('db'),
        pg: resolve('components/.playground'),
        helpers: resolve('helpers'),
        '~components': resolve('components')
      })
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          stylus: {
            use: stylusPlugins,
            preferPathResolver: 'webpack'
          }
        }
      })
    ]
  }
}
