<template lang="pug">
p.crumbs(v-if="$lodger.crumbs.length")
  a(
    v-for=      "crumb in $lodger.crumbs.filter(c => c.tax !== 'utilizatori')"
    v-if=       "$lodger[crumb.tax] && $lodger[crumb.tax].subscribers[$lodger.mainSubName] && $lodger[crumb.tax].subscribers[$lodger.mainSubName].items[crumb.id]"
    :data-tax=  "crumb.tax"
  ) {{ $lodger[crumb.tax].subscribers[$lodger.mainSubName].items[crumb.id]['name' || 'id' || 'denumire' || 'proprietar'] }}
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
