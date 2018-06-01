<template lang="pug">
.bloc__heading(v-if="bloc && bloc.nume")
  h4.bloc__title {{ bloc.nume }}
  .bloc__actiuni(v-if="modificabil")
    buton(
      styl=     "unstyled"
      icon=     "edit"
      icon-only
      @click=   "openModal('bloc.edit')"
      tooltip
    ) {{ $t('bloc.edit.title') }}
    buton(
      styl=     "unstyled"
      @click=   "stergeBloc(bloc._id)"
      icon=     "trash"
      icon-only
      tooltip
      dangerous
    ) {{ $t('bloc.delete') }}
</template>

<script>
import buton from 'form/button'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    buton
  },
  computed: mapGetters({
    bloc: 'bloc/selectat'
  }),
  props: {
    modificabil: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapActions({
      selecteazaBloc: 'bloc/selecteaza',
      openModal: 'modal/open'
    })
  }
}
</script>
