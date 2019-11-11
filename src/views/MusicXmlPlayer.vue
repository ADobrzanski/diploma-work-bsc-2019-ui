<template>
    <div id="player-container">
      <Score v-bind:xml="this.xml" />
    </div>
</template>

<script>
import Score from '../components/Score.vue';
import exampleMxml from '../assets/BrookeWestSample.musicxml';

export default {
  name: 'MxmlPlayer',
  components: {
    Score,
  },
  data() {
    return {
      xml: exampleMxml,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
