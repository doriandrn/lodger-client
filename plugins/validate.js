import Vue from 'vue'
import ro from 'vee-validate/dist/locale/ro'
import VeeValidate, { Validator } from 'vee-validate'

// Install the Plugin and set the locale.
Vue.use(VeeValidate, {
  locale: 'ro'
})
