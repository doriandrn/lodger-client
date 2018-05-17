import Debug from 'debug'
import Vue from 'vue'

/* enables debug only if not in production */
if (process.env.NODE_ENV !== 'production') {
  Debug.enable('lodger:*')
}

Vue.use({
  install: (Vue, options) => {
    // console.log('PLUGININSTAL', this)
    Vue.prototype.debug = new Debug(`lodger:main`)
    Vue.mixin({
      created () {
        try {
          const { $vnode: { componentOptions: { tag } }, debug } = this
          this.debug = Debug(tag ? `lodger:${tag}` : 'lodger:pagina')
        } catch (e) {
          // nu tre sa se intample nimic aici !!!
          // erori de destructurare, ignora-le !!!
        }
      }
    })
  }
})
