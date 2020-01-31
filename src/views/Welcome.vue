<template>
  <v-container>
    <navigation-drawer :expanded="true"/>
    <div class="main">
        <div class="font-weight-thin text-left pa-2 mt-8 headline">Czego nauczysz się dzisiaj?</div>
        <v-text-field
          append-icon="mdi-magnify"
          class="font display-1 font-weight-thin"
          :loading="isDataLoading"
          @input="text => searchSubject.next(text)"
        ></v-text-field>

        <v-spacer></v-spacer>

        <scores-provider
          :option="option"
          :searchPhrase="searchPhrase"
        >
          <template #default="{ items, toggleFavourite }">
            <scores-table
              :items="items"
              @click:row="handleScoreClick"
              @click:favourite="toggleFavourite"
            />
          </template>
        </scores-provider>
    </div>
  </v-container>
</template>

<script>
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import NavigationDrawer from '../components/Welcome/NavigationDrawer.vue';
import ScoresTable from '../components/Welcome/ScoresTable.vue';
import ScoresProvider from '../components/Welcome/ScoresProvider.vue';

export default {
  components: {
    'navigation-drawer': NavigationDrawer,
    ScoresTable,
    ScoresProvider,
  },
  props: ['option'],
  data() {
    return {
      isDataLoading: false,
      searchPhrase: '',
      searchSubject: new Subject(),
    };
  },
  watch: {
    option() {
      this.searchPhrase = '';
    },
  },
  methods: {
    handleScoreClick() {

    },
  },
  mounted() {
    this.searchSubject.pipe(
      debounceTime(1000),
    ).subscribe((phrase) => { this.searchPhrase = phrase; });
  },
};
</script>

<style scoped>
.main {
  width: 850px;
  margin: 0 auto;
}

@media screen and (max-width: 900px){
  .main {
    width: 100%;
  }
}

</style>
