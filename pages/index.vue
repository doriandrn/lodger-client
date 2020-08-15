<template lang="pug">
sction#init.user(v-if="!hasUsers")
  header
    h1 Bun venit!
    p.intro Îți mulțumim că ai ales să încerci Lodger!

  main
    h2 Hai să facem cunoștință!
    frm(
      v-if=   "$lodger.utilizatori"
      :fields = "$lodger.utilizatori.form.fields"
    )

  .boom index
</template>

<script>
import sction from 'c/section'
import frm from 'c/form.vue'

export default {
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
    const hasUsers = sub && sub.ids.length
    return { hasUsers }
  },
  data () {
    return {
      hasUsers: false,
      utilizator: {
        _id: null
      }
    }
  },
  components: {
    frm,
    sction
  }
}
</script>

