<template lang="pug">
.bloc__heading
  h4.bloc__title {{ bloc.nume }}
  .bloc__actiuni(v-if="modificabil")
    buton(
      styl=     "unstyled"
      icon=     "edit"
      icon-only
      @click=   "selecteazaBloc({ id: bloc._id, modificabil })"
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
export default {
  components: {
    buton
  },
  props: {
    bloc: {
      type: Object,
      default () {
        return {}
      }
    },
    modificabil: {
      type: Boolean,
      default: true
    }
  }
}
</script>
