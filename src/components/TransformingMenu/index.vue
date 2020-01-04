<template>
  <v-card
    style="position: absolute; z-index: 20;"
    class="mx-8 my-12"
    width="256"
  >
    <v-tabs
      :height=0
      :value="searchMode ? 1 : 0"
    >

      <v-tab-item>
        <user-panel
          @click:search="searchMode = true"
          @file:upload="file => $emit('file:upload', file)"/>
      </v-tab-item>

      <v-tab-item>
        <search-panel @click:hamburger="searchMode = false"/>
      </v-tab-item>

    </v-tabs>
  </v-card>
</template>

<script>
import UserPanel from './UserPanel.vue';
import SearchPanel from './SearchPanel.vue';

export default {
  name: 'playback-contols-bar',
  components: {
    UserPanel,
    SearchPanel,
  },
  data() {
    return {
      searchMode: true,
    };
  },
};
</script>

<style>

</style>
