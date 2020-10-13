<template lang="pug">
img(
  v-if=   "image",
  :src=   "image"
)
input(
  v-else
  type=   "file",
  :id=    "id",
  @change="onFileChange"
)
</template>

<script>
import labl from 'form/label'
import buton from 'form/button'

export default {
  data () {
    return {
      image: ''
    }
  },
  components: {
    labl,
    buton
  },
  props: {
    id: {
      type: String,
      default () {
        return 'demo::replace'
      }
    },
    required: {
      type: Boolean,
      default () {
        return false
      }
    },
    message: {
      type: String,
      default () {
        return ''
      }
    },
    error: {
      type: Boolean,
      default () {
        return false
      }
    },
    label: {
      type: String,
      default () {
        return ''
      }
    }
  },
  methods: {
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.createImage(files[0])
    },
    createImage (file) {
      // var image = new Image()
      var reader = new FileReader()
      var vm = this
      reader.onload = (e) => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function (e) {
      this.image = ''
    }
  }
}
</script>

<style lang="stylus">
input[type="file"]
  min-width: 14rem;
  margin: 0;
  opacity: 0;
  outline none
  visibility hidden

  &:focus
    ~ .holder
      box-shadow: 0 0 0 .075rem #fff, 0 0 0 .2rem #0074d9;

.holder
  position: absolute 0 0 auto 0;
  z-index: 5;
  height: 2.5rem;
  padding: .5rem 1rem;
  line-height: 1.5;
  color: #555;
  background-color: #fff;
  border: .075rem solid #ddd;
  border-radius: .25rem;
  box-shadow: inset 0 .2rem .4rem rgba(0,0,0,.05);
  user-select: none;

  &:after
    content: "Choose file...";

  &:before
    position: absolute;
    top: -.075rem;
    right: -.075rem;
    bottom: -.075rem;
    z-index: 6;
    display: block;
    content: "Browse";
    height: 2.5rem;
    padding: .5rem 1rem;
    line-height: 1.5;
    color: #555;
    background-color: #eee;
    border: .075rem solid #ddd;
    border-radius: 0 .25rem .25rem 0;
</style>
