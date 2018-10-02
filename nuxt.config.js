var path = require('path')
var webpack = require('webpack')
const tsconfig = require('./tsconfig.json')
// const tslint = require('./tslint.json')

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
    { src: '~plugins/lodger' },
    { src: '~plugins/filters' },
    { src: '~plugins/validate' },
    { src: '~plugins/tabs' },
    { src: '~plugins/portal' },
    { src: '~plugins/range' },
    { src: '~plugins/i18n' },
    { src: '~plugins/swiper', ssr: false },
    { src: '~plugins/tooltips', ssr: false }
  ],
  router: {
    base: '/ui/',
    fallback: true,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active-exact'
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
    // 'typescript'
    // 'nuxt-ts-module'
    // '@nuxtjs/proxy',
    // '@nuxtjs/pwa'
  ],
  // typescript: {
  //   tsconfig,
  //   // tslint
  // },
  /*
  ** Build configuration
  */
  build: {
    externals: {
      fs: 'commonjs fs'
    },

    extend (config) {
      config.node = { fs: 'empty' }

      const stylLoader = config.module.rules.filter(module => String(module.test).indexOf('styl') > -1)[0]

      stylLoader.oneOf.forEach(one => {
        const module = one.use.filter(o => o.loader === 'stylus-loader')[0]
        if (!module) return
        module.options.context = __dirname
        Object.assign(module.options, {
          use: stylusPlugins,
          preferPathResolver: 'webpack'
        })
      })

      // TS Support
      config.module.rules.push({
        loader: 'ts-loader',
        test: new RegExp(/\.ts$/),
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true // SET TO FALSE FOR TSLINT
        }
      })
      if (config.resolve.extensions.indexOf('.ts') === -1) {
        config.resolve.extensions.push('.ts')
      }

      // Extend aliases
      Object.assign(config.resolve.alias, {
        'c': resolve('components'),

        styles: resolve('assets/styles'),
        UI: resolve('components/UI'),
        widgets: resolve('components/widgets'),
        form: resolve('components/formElements'),
        pg: resolve('components/.playground'),
        struct: resolve('components/struct'),

        lodger: resolve('lodger'),
        // lib: resolve('lodger/lib'), -> this doesnt work as it interfers to other libs
        'lodger-plugins': resolve('lodger/plugins'),
        cfg: resolve('lodger/config'),
        forms: resolve('lodger/lib/forms'),
        helpers: resolve('lodger/lib/helpers')
      })
    }
  }
}
