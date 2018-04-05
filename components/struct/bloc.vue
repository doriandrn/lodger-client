<template lang="pug">
ol.scari(v-if="id")
  li(v-for="scara, iScara in bloc.scari")
    label.nume Scara {{ scara.id }}
    .scara
      ol.etaje
        li(v-for="i in range(0, Number(scara.etaje || 0)+1)")
          buton(
            v-for=  "ap in apartamenteEtaj({ bloc: bloc._id, scara: iScara, etaj: i })",
            :key=   "ap._id"
            :class= "{ ultimul: ap._id === ultimulApAdaugat}"
            @click= "openModal({ id: 'apartament.edit', data: { _id: ap._id }})"
            tooltip
          ) {{ ap.proprietar }}
            em.ap__nr {{ ap.nr }}
          buton.adauga(
            styl=   "unstyled"
            tooltip
            @click= "openModal({ id: 'apartament.new', data: { bloc: bloc._id, scara: Number(iScara), etaj: i } })",
            icon=   "plus-circle"
            icon-only
          ) {{ $t('apartament.new.title') }}
</template>

<script>
import buton from 'form/button'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      default: null
    },
    modificabil: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      blocuri: 'blocuri',
      apartamenteEtaj: 'apartament/localizeaza',
      ultimulApAdaugat: 'apartament/ultim'
    }),
    bloc () {
      return this.blocuri[this.id]
    }
  },
  methods: {
    ...mapActions({
      openModal: 'modal/open'
    })
  },
  components: {
    buton
  }
}
</script>
