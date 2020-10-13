<template lang="pug">
.avatar(:class="{ disabled }")
  img(:src="value || placeholder")
  file(v-if=  "!disabled" :id="id")
</template>

<script>
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-avataaars-sprites';
import file from 'c/formElements/file'

const avatars = new Avatars(sprites, {
  base64: true,
  style: 'circle'
});

export default {
  computed: {
    placeholder () {
      return avatars.create(this.seed)
    }
  },
  props: {
    id: {
      type: String,
      default: 'avatar'
    },
    value: {
      type: String,
      default: null
    },
    seed: {
      type: String,
      default: 'noname'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    file
  }
}
</script>

<style lang="stylus">
.avatar
  position relative
  img
    max-width 160px
    height auto
</style>
