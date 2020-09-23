<template lang="pug">
sction#init.user(v-if="!ids.length")
  header
    h1 {{ $lodger.i18n.welcome.title }}
    p.intro {{ $lodger.i18n.welcome.intro }}

  main
    h2 {{ $lodger.i18n.taxonomies.utilizatori.new.title }}
    frm(
      v-if=   "$lodger.utilizatori"
      :fields = "$lodger.utilizatori.form.fields"
      :translationObject = "$lodger.i18n.taxonomies.utilizatori.fields"
      :isNew="true"
      :submitText = "$lodger.i18n.next"
      @submit=  "$lodger.utilizatori.put($event)"
    )

sction#init.asoc(v-else)
  p next stpe, apsoc
</template>

<script>
import sction from 'c/section'
import frm from 'c/form.vue'
import { computed } from 'mobx'
import { Observer } from 'mobx-vue'

export default Observer ({
  /**
   * 1. Create the user subscriber;
   * Are there users? Skip the user creeation intro part
   *
   * 2. Craete asociatii subscriber;
   */
  async asyncData ({ $lodger }) {
    const subName = 'main'
    await $lodger.utilizatori.subscribe(subName)
    const sub = $lodger.utilizatori.subscribers[subName]
    const fhasUsers = sub && sub.ids.length
    const { items, ids } = sub
    return { fhasUsers, items, ids }
  },
  data () {
    return {
      fhasUsers: false,
      items: {},
      ids: [],
      utilizator: {
        _id: null
      },
    }
  },
  computed: {
    hasUsers () {
      return this.ids.length
    }
  //   t () { return this.$lodger.i18n.welcome }
  },
  components: {
    frm,
    sction
  }
})
</script>
