<template>
  <v-card>
    <v-list>
      <v-list-item >
          <v-text-field solo hide-details
              class="my-2"
              append-icon="mdi-magnify"
              @click:prepend="$emit('click:hamburger', true)"
              @input="text => querySubject.next(text)"
              prepend-icon="mdi-menu"/>
      </v-list-item>
    </v-list>

    <v-progress-linear query indeterminate :active="isDataLoading" />
    <v-divider></v-divider>

    <v-list nav dense>
        <v-list-item link
          v-for="(song, i) in songs"
          :key="i"
          @click="fetchScore(song.link)"
        >
          <v-list-item-icon class="mr-4">
            <v-icon>mdi-music-note</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              class="text-left"
              v-text="song.title">
            </v-list-item-title>

            <v-list-item-subtitle
              class="text-left"
              v-if="!!song.composer"
              v-text="song.composer">
            </v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
/* eslint-disable no-param-reassign */
import * as R from 'ramda';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { searchScores } from '../../api/queries';
// import { publicScores } from '../../api/queries';

export default {
  name: 'search-panel',
  props: ['active'],
  /* watch: {
    active(newVal, oldVal) {
      if (!R.equals(newVal, oldVal)) {
        if (newVal) {
          this.$apollo.queries.songs.refetch();
        }
      }
    },
  },
  apollo: {
    songs: publicScores,
  }, */
  data() {
    return {
      songs: [],
      querySubject: new Subject(),
      isDataLoading: false,
    };
  },
  mounted() {
    this.querySubject.pipe(
      debounceTime(300),
    ).subscribe(this.fetchSearchResult);
  },
  methods: {
    log(a) { console.log(a); },
    fetchSearchResult(searchPhrase) {
      if (!R.isEmpty(searchPhrase)) {
        this.isDataLoading = true;
        this.$apollo.query(searchScores(searchPhrase))
          .then((response) => {
            this.songs = response.data.scores;
          })
          .catch(error => console.error(error))
          .finally(() => {
            this.isDataLoading = false;
          });
      }
    },
    fetchScore(link, callback = () => {}) {
      fetch(link)
        .then((response) => {
          if (!response.ok) {
            console.error('Fetching score failed.');
          } else {
            response.blob().then(
              blob => this.$store.dispatch('setRemoteFile', blob),
            );
          }
        }).catch(() => {
          console.error('Network error during score fetching.');
        }).finally(callback);
    },
  },
};
</script>

<style>

</style>
