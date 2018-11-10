// <template lang="pug">
// sction.registru(
//   :title=   "$t('registru.title')"
// )
//   split.registru__controale
//     field(
//       v-for=    "optiune in optiuni",
//       v-model=  "arata",
//       :key=     "optiune",
//       :id=      "optiune"
//       :name=    "optiune"
//       type=     "checkbox"
//       :label=   "$t(`registru.${optiune}`)"
//       required= true
//     )
//     .filtre(
//       slot= "right"
//     )
//       field(
//         type=     "radios",
//         label=    "sort.label"
//         v-model=  "sortFilter"
//         id=       "filtruSortare"
//         :options=  "{ la: { label: 'sort.la' }, suma: { label: 'sort.suma' }, nrChintanta: { label: 'sort.nrChitanta' } }"
//         required= true
//       )

// </template>

// <script>
// import sction from 'c/section'
// import split from 'c/split'
// import field from 'form/field'
// import buton from 'form/button'
// import incasari from 'c/incasari'
// import { mapGetters } from 'vuex'

// export default {
//   data () {
//     return {
//       arata: [],
//       optiuni: ['incasari', 'cheltuieli'],
//       incasari: null,
//       incarcate: false,
//       sortFilter: 'la',
//       index: 1,
//       limit: 3
//     }
//   },
//   computed: {
//     ...mapGetters({
//       asociatieActiva: 'asociatie/activa'
//     }),
//     findCriteria () {
//       const { asociatieActiva } = this
//       return { asociatieId: asociatieActiva._id }
//     },
//     sortCriteria () {
//       const { sortFilter } = this
//       return { [sortFilter]: -1 }
//     },
//     async _incasari () {
//       const { $db, index, limit, findCriteria, sortCriteria } = this
//       this.incarcate = false
//       // let chgs
//       // await $db.incasari.find(findCriteria).limit(limit*index).sort(sortCriteria).$.subscribe(async changes => {
//       //   if (!changes) return
//       //   this.incasari = changes
//       //   chgs = changes
//       //   if ( index > 1 ) this.incarcate = true
//       // })
//       const incasari = await lodger.incasari({ limit, sort, index, find })
//       this.incarcate = true
//       return incasari
//       // return chgs
//     }
//   },
//   async mounted () {
//     // const { $db, asociatieActiva, index } = this
//     const { _incasari } = this
//   },
//   components: {
//     sction,
//     field,
//     buton,
//     split,
//     incasari
//   }
// }
// </script>

// <style lang="stylus">
// @require '~styles/config'
// colors = config.palette

// .registru
//   width 100%

//   &__controale
//   &__data
//     max-width 639px
//     width 100%
//     margin 0 auto

//   &__controale
//     flex 0 1 24px
//     margin-bottom 16px

//   &__data
//     flex 1 1 100%

//   .filtre
//     width 100%

//   ul
//     list-style-type none
//     padding 0
//     margin-bottom 32px

//     li
//       background white

//       &:not(:last-child)
//         border-bottom: 1px solid colors.borders
// </style>
