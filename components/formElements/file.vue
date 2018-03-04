<template lang="pug">
span.input__file(:class="[(error ? 'field--error' : '')]")
  labl.field__label(
    :for= "id",
    :label= "label",
    :required= "required"
  )
  img(
    v-if=   "image",
    :src=   "image"
  )
  inpt(
    v-else,
    type=   "file",
    :id=    "id",
    @change="onFileChange"
  )
  buton(
    size=     "medium",
    type=     "button",
    :text=    "`$`",
    @clicked= "image ? removeImage : createImage"
  ) {{ (image ? 'Remove' : 'Upload') }} 
  p.field__message {{ message }}
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
