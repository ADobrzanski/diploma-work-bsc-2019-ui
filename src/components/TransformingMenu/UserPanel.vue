/* eslint-disable no-confusing-arrow */
<template>
  <v-card>

    <v-list v-if="!!currentUser">
      <v-list-item>

        <v-list-item-avatar>
          <v-img :src="this.avatarSrc"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="title">{{currentUser.name}}</v-list-item-title>
          <v-list-item-subtitle>{{currentUser.email}}</v-list-item-subtitle>
        </v-list-item-content>

      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
      nav
      dense
    >
      <v-list-item link
        v-for="(item, i) in items"
        :key="i"
        @click="item.callback"
        :disabled="item.disabled()"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-text="item.text()"></v-list-item-title>
        </v-list-item-content>

      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { currentUser } from '../../api/queries';
import { uploadScore as upload } from '../../api/mutations';
import { openFileDialog } from './helpers';
import { onLogout } from '../../vue-apollo';

export default {
  name: 'user-panel',
  apollo: {
    currentUser,
  },
  data() {
    return {
      currentUser: null,
      items: [
        {
          text: () => 'Szukaj utowru',
          icon: 'mdi-magnify',
          callback: () => this.$emit('click:search'),
          disabled: () => false,
        },
        {
          text: () => 'Otwórz plik',
          icon: 'mdi-folder-open',
          callback: openFileDialog('application/vnd.recordare.musicxml+xml', this.handleFileInput),
          disabled: () => false,
        },
        {
          text: () => 'Zapisz w chmurze',
          icon: 'mdi-cloud-upload',
          callback: () => this.uploadScore(),
          disabled: () => !this.btnSyncCloudActive,
        },
        {
          text: () => this.btnLoginText,
          icon: 'mdi-power',
          // eslint-disable-next-line no-confusing-arrow
          callback: () => !this.currentUser
            ? this.openAuthDialog()
            : this.logOut(),
          disabled: () => false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      isFileSynced: state => state.application.fileSynced,
      scoreDetails: state => state.score.details,
      file: state => state.application.file,
    }),
    avatarSrc() {
      return `https://eu.ui-avatars.com/api/?name=${this.currentUser.name}`;
    },
    btnLoginText() {
      return !this.currentUser ? 'Zaloguj się' : 'Wyloguj się';
    },
    btnSyncCloudActive() {
      return !!this.currentUser && !this.isFileSynced;
    },
  },
  methods: {
    handleFileInput(e) {
      const file = e.target.files[0];
      this.$store.dispatch('setLocalFile', file);
    },
    openAuthDialog() {
      this.$store.commit('SET_APPLICATION_AUTH_DIALOG', true);
    },
    logOut() {
      onLogout(this.$apollo.provider.defaultClient);
    },
    uploadScore() {
      this.$apollo.mutate(upload(
        this.scoreDetails,
        this.file,
      )).then(() => {
        console.log('uploadSuccedd');
        this.$store.commit('SET_APPLICATION_FILE_SYNCED', true);
        console.log(`is synced? ${this.isFileSynced}`);
        console.log(`btnSyncCloudActive ${this.btnSyncCloudActive}`);
      }).catch((error) => {
        console.error(error);
      });
    },
  },
};
</script>

<style>

</style>
