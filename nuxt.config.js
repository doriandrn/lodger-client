var path = require('path')
var webpack = require('webpack')

const debug = !(process && process.env.NODE_ENV === 'production')

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
  manifest: {
    name: 'Lodger',
    short_name: 'Lodger',
    lang: 'ro',
    description: 'Administrează asociații de locatari ușor, eficient și cu plăcere',
    theme_color: '#3B8070',
    background_color: '#fff'
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  css: [{
    src: '~assets/styles/index.styl',
    lang: 'stylus'
  }],
  plugins: [
    { src: '~plugins/debug' },
    { src: '~plugins/db' },
    { src: '~plugins/validate' },
    { src: '~plugins/tabs' },
    { src: '~plugins/portal' },
    { src: '~plugins/range' },
    { src: '~plugins/i18n' },
    { src: '~plugins/swiper', ssr: false }
  ],
  router: {
    linkActiveClass: 'active',
    base: '/ui/'
  },
  axios: {
    credentials: true,
    baseURL: 'https://api.graph.cool/simple/v1/lodger-v2',
    debug,
    // requestInterceptor: (config, { store }) => {
    //   const token = store ? store.getters['user/autentificat'] : ''
    //   // daca nu e autentificat
    //   if (token) {
    //     config.headers.common['Authorization'] = `Bearer ${token}`
    //   }

    //   return config
    // }
  },
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/proxy',
    // '@nuxtjs/pwa'
  ],
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'moment',
      'numeral'
    ],
    externals: {
      fs: 'commonjs fs'
    },

    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {}
      config.node = { fs: 'empty' }

      // Extend aliases
      Object.assign(config.resolve.alias, {
        styles: resolve('assets/styles'),
        UI: resolve('components/UI'),
        widgets: resolve('components/widgets'),
        form: resolve('components/formElements'),
        struct: resolve('components/struct'),
        forms: resolve('forms'),
        lodger: resolve('lodger.js'),
        db: resolve('db'),
        cc: resolve('components/composed'),
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
