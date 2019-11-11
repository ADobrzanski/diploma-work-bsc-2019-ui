<template>
  <div id="drop_zone"
    @drop.prevent="handleDrop"
    @dragover.prevent>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'drop-zone',
  props: {
    onDrop: {
      type: Function,
    },
  },
  methods: {
    handleDrop(event) {
      const { onDrop } = this;

      if (event.dataTransfer.items) {
        if (event.dataTransfer.items.length === 1) {
          const file = event.dataTransfer.items[0].getAsFile();
          onDrop(file);
        }
      } else if (event.dataTransfer.files) {
        if (event.dataTransfer.files.length === 1) {
          const file = event.dataTransfer.files[0];
          onDrop(file);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
