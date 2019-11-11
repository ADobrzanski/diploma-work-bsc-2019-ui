<template>
  <button
    class="button"
    @click="onClick">
    <font-awesome-icon :icon="icon"  size="2x"/>
  </button>
</template>

<script>
export default {
  name: 'playback-button',
  props: {
    icon: String,
    onClick: Function,
  },
};
</script>

<style lang="scss" scoped>
.button {
  background: transparent;
  border: 0;
}
</style>
