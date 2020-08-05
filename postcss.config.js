var packageConfig = require('./package.json')

module.exports = {
  plugins: {
    'lost': {},
    'postcss-font-magician': {
      // protocol: 'https:',
      display: 'swap',
      hosted: ['~assets/fonts'],
      variants: {
        'Cormorant Garamond': {
          '100': ['woff, eot, woff2'],
          '300': ['woff, eot, woff2'],
          '400': ['woff, eot, woff2'],
          '500': ['woff, eot, woff2'],
          '600': ['woff, eot, woff2'],
          '700': ['woff, eot, woff2'],
        },
        foundries: ['google']
        // 'Futura': {
        //   '400': ['woff, eot, woff2'],
        //   '500': ['woff, eot, woff2'],
        //   '600': ['woff, eot, woff2'],
        //   '700': ['woff, eot, woff2'],
        // },
        // 'Roboto Condensed': {
        //   '400': ['woff, eot, woff2'],
        //   '500': ['woff, eot, woff2'],
        //   '600': ['woff, eot, woff2'],
        //   '700': ['woff, eot, woff2'],
        // }
      }
    },
    'postcss-short': {},
    'postcss-pxtorem': {},
    'autoprefixer': {}
  }
}
