// import Vue from 'vue'
// import VueI18n from 'vue-i18n'

// Vue.use(VueI18n)

// export default ({ app, store }) => {
//   // Set i18n instance on app
//   // This way we can use it in middleware and pages asyncData/fetch
//   console.info('APP IN I!I*N PLUGIN', app)
//   const locale = app.$lodger.getters['locale']
//   app.i18n = new VueI18n({
//     locale,
//     fallbackLocale: 'ro',
//     messages: {
//       'en': require('~/locales/en.js').default,
//       'ro': require('~/locales/ro.js').default
//     }
//   })

//   app.i18n.path = (link) => {
//     if (app.i18n.locale === app.i18n.fallbackLocale) {
//       return `/${link}`
//     }

//     return `/${app.i18n.locale}/${link}`
//   }
// }
