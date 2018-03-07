<template lang="pug">
.split
  .left
    slot
  .right(v-if="$slots.right")
    slot(name="right")
</template>
