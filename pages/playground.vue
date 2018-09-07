<template lang="pug">
sction#pg
  .boxes
    .box
      frm(:form="$lodger.forms[0]")
    .asociatii.box
      button(@click="adauga('asociatie', { name: faker.company.companyName() })") + asoc
      h3 {{ idsAsociatii.length }}/{{ asociatiiCount }} asociatii
      //- p last: {{ $lodger.getters['asociatie/last'] }}
      ul(v-if="asociatii")
        li(
          v-for=  "asoc, i in asociatii"
          @click= "selecteaza(i)"
        ) {{ asoc.name }}
      button.more(@click="criteriu.limit = criteriu.limit + criteriu.limit; sub()") MOR

    .box.asociatie(v-if="idAsociatieSelectata")
      h2 Selected asoc: {{ asociatieSelectata.name }}
      .asociatie__details
        p #[em balanta] {{ asociatieSelectata.balanta }}

  .box.prefs
    h6 preferences list
</template>

<script lang="ts">
import Vue from 'vue'
import sction from 'c/section'
import faker from 'faker'
import frm from 'c/form'
import { State, Action, Getter } from 'vuex-class'
import Component from 'vue-class-component'

const namespace = 'asociatie'

@Component({
  components: {
    sction,
    frm
  },
  layout: 'tspg'
})
  export default class Playground extends Vue {
    @Getter('selected', { namespace }) idAsociatieSelectata: string
    @Action('select', { namespace }) selecteaza: any;

    data () {
      return {
        asociatii: {},
        criteriu: {
          limit: 5
        },
        asociatiiCount: -1
      }
    }

    get asociatieSelectata () {
      return this.asociatii[this.idAsociatieSelectata]
    }

    get idsAsociatii () {
      return Object.keys(this.asociatii)
    }

    get now () {
      return new Date(this.unixTime * 1000).toISOString()
    }

    beforeCreate () {
      // this.$store.registerModule('LodgerStore', this.$lodger.store)
      this.$store = this.$lodger.store
    }

    mounted () {
      this.faker = faker
      this.sub()
      this.debug(this.$lodger)
    }  

    sub () {
      this.$lodger.subscribe(this.asociatii, 'asociatii', this.criteriu)
    }

    async adauga () {
      return await this.$lodger.put(...arguments)
    }
  }
</script>

<style lang="stylus">
#webpack-hot-middleware-clientOverlay
  display none

#pg
  .inner
    display flex
    flex-flow row nowrap
  ul
    padding 0

  *
    user-select none

  li
    cursor pointer

  .box
    display flex
    flex-flow row wrap
    margin 8px

    &es
      display flex
      flex-flow row wrap

    > *
      flex 1 1 100%

    &.prefs
      margin-left auto
</style>
