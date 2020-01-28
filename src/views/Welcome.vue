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

        <scores-table
          :items="scores"
          @click:row="handleScoreClick"
          @click:favourite="toggleScoreFavourite"
        />
    </div>
  </v-container>
</template>

<script>
import * as R from 'ramda';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { searchScores, publicScores } from '../api/queries';

import NavigationDrawer from '../components/Welcome/NavigationDrawer.vue';
import ScoresTable from '../components/Welcome/ScoresTable.vue';

export default {
  components: {
    'navigation-drawer': NavigationDrawer,
    ScoresTable,
  },
  apollo: {
    publicScores: publicScores('publicScores'),
  },
  data() {
    return {
      isDataLoading: false,
      searchPhrase: '',
      searchSubject: new Subject(),
      favouriteSubject: new Subject(),
      scores: [],
      publicScores: [],
    };
  },
  watch: {
    searchPhrase(phrase) {
      if (phrase !== '') {
        this.fetchSearchResults(phrase);
      }
    },
    publicScores: {
      handler() {
        if (this.searchPhrase === '') {
          this.scores = this.publicScores;
        }
      },
      immediate: true,
    },
  },
  methods: {
    log(a) { console.log(a); },
    fetchSearchResults(searchPhrase) {
      if (!R.isEmpty(searchPhrase)) {
        this.isDataLoading = true;
        this.$apollo.query(searchScores(searchPhrase))
          .then((response) => {
            this.scores = response.data.searchScores;
          })
          .catch(error => console.error(error))
          .finally(() => {
            this.isDataLoading = false;
          });
      }
    },
    handleScoreClick() {

    },
    toggleScoreFavourite() {

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
