<template lang="pug">
ul.selAp
  li(v-for="blc in Object.keys(apsGrupate)") {{ blc }}
  //- li(v-for="apId, index in optiuni") {{ apartamente[apId].proprietar }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    selectate: {
      type: Array,
      default () {
        return []
      }
    },
    optiuni: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    apsGrupate () {
      const { blocuri, apartamente, debug, optiuni } = this
      debug('GGGG')
      if (!optiuni || !optiuni.length || typeof optiuni !== 'object') return
      const grupate = {}
      debug(optiuni)

      optiuni.forEach(apId => {
        const ap = apartamente[apId]
        const { bloc, scara, etaj } = ap
        const { nume, scari } = blocuri[bloc]

        debug(scari)
        if (!grupate[nume]) grupate[nume] = {}
        if (scari && Object.keys(scari).length) {
          scari.forEach(scr => {
            // daca sunt apartamente 
            const { id } = scr
            debug(id)
            if (scara === id) {
              if (!grupate[nume][id]) {
                grupate[nume][id] = []
              }
              grupate[nume][id].push(apId)
            }
          })
        }

      })

      return grupate
    },
    ...mapGetters(['apartamente', 'blocuri'])
  }
}
</script>
