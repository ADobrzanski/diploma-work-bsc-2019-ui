<template>
  <v-card>
    <v-list>
      <v-list-item >
          <v-text-field solo hide-details
              class="my-2"
              append-icon="mdi-magnify"
              @click:prepend="$emit('click:hamburger', true)"
              prepend-icon="mdi-menu"/>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense v-if="$apollo.queries.songs.loading">
      <v-skeleton-loader
        class="mx-auto"
        type="list-item-two-line">
      </v-skeleton-loader>
      <v-skeleton-loader
        class="mx-auto"
        type="list-item-two-line">
      </v-skeleton-loader>
      <v-skeleton-loader
        class="mx-auto"
        type="list-item-two-line">
      </v-skeleton-loader>
    </v-list>
    <v-list nav dense v-if="!$apollo.queries.songs.loading">
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
import { publicScores } from '../../api/queries';

export default {
  name: 'search-panel',
  apollo: {
    songs: publicScores,
  },
  data() {
    return {
      songs: [],
    };
  },
  methods: {
    fetchScore(link) {
      fetch(link)
        .then((response) => {
          if (!response.ok) {
            console.error(`Fetching score from ${link} failed.`);
          } else {
            response.blob().then(
              blob => this.$store.dispatch('setRemoteFile', blob),
            );
          }
        }).catch(() => {
          console.error('Network error during score fetching.');
        });
    },
  },
};
</script>

<style>

</style>
