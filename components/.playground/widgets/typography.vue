<template lang="pug">
widget.typecheck(title="Tyop chek" expand)
  h1 Lorem 2347 ipsum dolor sit amet, consectetur adipiscing elit. #[a(href="#") Phasellus mattis] pretium leo, et dignissim orci elementum et. Duis sit amet augue mauris.
  p Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. Donec a dignissim neque. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
  h2 Lorem ipsume dolor sit amet, consectetur adipiscing elit 28. Phasellus mattis pretium leo, et dignissim orci elementum et. Duis sit amet augue mauris.
  p Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. Donec a dignissim neque. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
  blockquote Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. Donec a dignissim neque. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
  h3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mattis pretium leo, et dignissim orci elementum et. Duis sit amet augue mauris.
  p Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. #[a(href="#") Donec a dignissim neque]. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
  h4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mattis pretium leo, et dignissim orci elementum et. Duis sit amet augue mauris.
  p Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. Donec a dignissim neque. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
  h5 Lorem ipsum dolor sit amet, consectetur adipiscing elit. #[a(href="#") Phasellus mattis pretium leo], et dignissim orci elementum et. Duis sit amet augue mauris.
  p Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. Donec a dignissim neque. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
  h6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mattis pretium leo, et dignissim orci elementum et. Duis sit amet augue mauris.
  p Aenean laoreet dui ac nisi dictum, id porttitor risus ultricies. Sed venenatis risus in iaculis fringilla. Donec a dignissim neque. Mauris ut nisl eget lectus feugiat luctus. Nullam condimentum erat enim, nec semper mauris rhoncus at. Nullam vitae aliquam odio. Quisque vehicula tempus dignissim. Sed ac pulvinar turpis. Suspendisse quam orci, rhoncus a nulla eu, commodo feugiat erat.
</template>

<script>
import widget from 'c/widget'

export default {
  components: {
    widget
  }
}
</script>

<style lang="stylus">
.typecheck
  .widget__content
    background-color transparent !important

    *
      position relative
      z-index 1
    &:before
      content ''
      position absolute 0
      z-index 0
      background-image repeating-linear-gradient(0deg, #ddd, #fff 1px, #fff 16px, #ddd, #fff 17px, #fff 32px)
      background-size 100% 625px
</style>
