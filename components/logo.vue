<template lang="pug">
h3.logo
  nuxt-link(to="/") #[symbol] Lodger
</template>

<style lang="stylus">
@require '~styles/config'

.logo
  > a
    padding-left 32px
    position relative

    &:before
      content ''
      background-color: config.typography.palette.headings
      mask-image embedurl('~static/icons/logo.svg', 'utf8')
      mask-size 18px
      mask-repeat no-repeat
      mask-position 50%
      size 20px
      position absolute
      left 0
      top 50%
      transform translateY(-50%)
</style>
