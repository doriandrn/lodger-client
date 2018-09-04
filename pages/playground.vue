<template lang="pug">
sction#pg
  .box
    .asociatii
      button(@click="adauga('asociatie', { name: faker.company.companyName() })") + asoc
      h3 {{ idsAsociatii.length }}/{{ asociatiiCount }} asociatii
      //- p last: {{ $lodger.getters['asociatie/last'] }}
      ul(v-if="asociatii")
        li(
          v-for=  "asoc, i in asociatii"
          @click= "selecteaza(i)"
        ) {{ asoc.name }}
      button.more(@click="criteriu.limit = criteriu.limit + criteriu.limit; sub()") MOR

    .asociatie(v-if="idAsociatieSelectata")
      h2 Selected asoc: {{ asociatieSelectata.name }}
      .asociatie__details
        p #[em balanta] {{ asociatieSelectata.balanta }}

  .box
    h6 preferences list
</template>

<script lang="ts">
import Vue from 'vue'
import sction from '~components/section'
import faker from 'faker'
import { State, Action, Getter } from 'vuex-class'
import Component from 'vue-class-component'

const namespace = 'asociatie'

@Component({
  components: {
    sction
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
      this.debug('add clicked', this)
      return await this.$lodger.put(...arguments)
    }
  }
</script>

<style lang="stylus">
#webpack-hot-middleware-clientOverlay
  display none
</style>
