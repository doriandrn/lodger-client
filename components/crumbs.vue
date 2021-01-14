<template lang="pug">
p.crumbs(v-if="Object.keys($l.crumbs).length")
  a(
    v-for=      "crumb, tax in $l.crumbs"
    v-if=       "$l[tax] && $l[tax].subscribers[$l.mainSubName] && $l[tax].subscribers[$l.mainSubName].items[crumb._id]"
    :data-tax=  "tax"
  ) {{ $l[tax].subscribers[$l.mainSubName].items[crumb._id]['name' || 'id' || 'denumire' || 'proprietar'] }}
</template>

<script>
import { Observer } from 'mobx-vue'
export default Observer ({})
</script>

<style lang="stylus">
.crumbs
  white-space nowrap
  margin 0

  > a
    padding 12px 20px
    width auto

    &:first-child
      padding-left 90px

    &:not(:last-child)
      background white

    &:not(:first-child)
      margin-left 1px
</style>
