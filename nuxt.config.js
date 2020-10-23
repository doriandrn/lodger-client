var path = require('path')

const debug = !(process && process.env.NODE_ENV === 'production')

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
  ssr: false,
  target: 'static',
  debug,
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
    { src: '~plugins/lodger' },
    { src: '~plugins/filters' },
    // { src: '~plugins/tabs' },
    { src: '~plugins/portal' },
    { src: '~plugins/range' },
    { src: '~plugins/swiper', ssr: false },
    { src: '~plugins/tooltips', ssr: false }
  ],
  router: {
    base: '/',
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

    extend (config) {
      config.node = { fs: 'empty' }
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
