var path = require('path')
var webpack = require('webpack')

const dev = process && process.env.NODE_ENV !== 'production'
const debug = dev

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Lodger',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  ssr: !dev,
  target: 'static',
  // server: {
  //   port: 8000, // default: 3000
  //   host: '0.0.0.0', // default: localhost,
  //   timing: false
  // },
  debug,
  env: process.env.NODE_ENV || 'dev',
  manifest: {
    name: 'Lodger',
    short_name: 'Lodger',
    lang: 'ro',
    description: 'Administrează asociații de locatari ușor, eficient și cu plăcere',
    theme_color: '#3B8070',
    background_color: '#fff'
  },
  // Loading page, can also be replaced wih a html,
  // https://github.com/nuxt/nuxt.js/blob/dev/packages/vue-app/template/views/loading/
  loadingIndicator: {
    name: 'cube-grid',
    color: '#3B8070',
    background: 'white'
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  css: [{
    src: '~assets/styles/index.styl',
    lang: 'stylus'
  }],
  hooks: {
    'render:done': [() => {console.info('shhit works')}],
    'render:errorMiddleware': [(app) => {
      console.log('a', app)
      app.use((error, _req, _res, next) => {
        if (error) {
          console.info("Logged in errorMiddleware", error);
        }
        next(error);
      })
    }
  ]
  },
  plugins: [
    { src: '~plugins/debug' },
    { src: '~plugins/lodger' },
    { src: '~plugins/filters' },
    // { src: '~plugins/tabs' },
    { src: '~plugins/portal' },
    { src: '~plugins/range' },
    { src: '~plugins/shortkeys' },
    { src: '~plugins/swiper', ssr: false },
    { src: '~plugins/tooltips', ssr: false }
  ],
  router: {
    // base: './',
    // mode: 'hash',
    fallback: true,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active-exact'
  },
  axios: {
    credentials: true,
    baseURL: 'https://api.graph.cool/simple/v1/lodger-v2',
    debug
  },
  modules: [
    '@nuxtjs/axios'
  ],

  /*
  ** Build configuration
  */
  build: {
    externals: {
      fs: 'commonjs fs'
    },

    babel: {
      babelrc: true
    },

    css: [
      'assets/styles/rupture.styl'
    ],

    postcss: {
      plugins: {
        'lost': {},
        // 'postcss-font-magician': {
        //   // protocol: 'https:',
        //   display: 'swap',
        //   hosted: ['~assets/fonts'],
        //   variants: {
        //     'Cormorant Garamond': {
        //       '100': ['woff, eot, woff2'],
        //       '300': ['woff, eot, woff2'],
        //       '400': ['woff, eot, woff2'],
        //       '500': ['woff, eot, woff2'],
        //       '600': ['woff, eot, woff2'],
        //       '700': ['woff, eot, woff2'],
        //     },
        //     foundries: ['google']
        //     // 'Futura': {
        //     //   '400': ['woff, eot, woff2'],
        //     //   '500': ['woff, eot, woff2'],
        //     //   '600': ['woff, eot, woff2'],
        //     //   '700': ['woff, eot, woff2'],
        //     // },
        //     // 'Roboto Condensed': {
        //     //   '400': ['woff, eot, woff2'],
        //     //   '500': ['woff, eot, woff2'],
        //     //   '600': ['woff, eot, woff2'],
        //     //   '700': ['woff, eot, woff2'],
        //     // }
        //   }
        // },
        'postcss-short': {},
        'postcss-pxtorem': {},
      },
      preset: {
        autoprefixer: {
          grid: false
        }
      }
    },

    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
          stylus: {
            include: [
              path.join(__dirname, 'node_modules', 'lodger')
            ],
            preferPathResolver: 'webpack',
            options: ['resolve url']
          }
        }
      })
    ],

    extend (config) {
      config.node = { fs: 'empty' }
      console.info(config.module.rules.filter(m => m.test && String(m.test).indexOf('styl') > -1))
      // Extend aliases
      Object.assign(config.resolve.alias, {
        stream: 'stream-browserify',
        os: 'os-browserify/browser',
        // fs: 'empty',
        'c': resolve('components'),
        styles: resolve('assets/styles'),
        helpers: resolve('helpers'),

        UI: resolve('components/UI'),
        widgets: resolve('components/widgets'),
        form: resolve('components/formElements'),
        pg: resolve('components/.playground'),
        struct: resolve('components/struct')
      })
    }
  }
}
