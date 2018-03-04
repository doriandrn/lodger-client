var packageConfig = require('./package.json')

module.exports = {
  exec: true,
  plugins: {
    'lost': {},
    'postcss-font-magician': {
      protocol: 'https:',
      display: 'swap',
      variants: {
        'Futura': {
          '400': ['woff, eot, woff2'],
          '500': ['woff, eot, woff2'],
          '600': ['woff, eot, woff2'],
          '700': ['woff, eot, woff2'],
        },
        'Roboto Condensed': {
          '400': ['woff, eot, woff2'],
          '500': ['woff, eot, woff2'],
          '600': ['woff, eot, woff2'],
          '700': ['woff, eot, woff2'],
        }
      }
    },
    'postcss-short': {},
    'postcss-flexbox': {},
    'postcss-pxtorem': {},
    'autoprefixer': {}
  }
}