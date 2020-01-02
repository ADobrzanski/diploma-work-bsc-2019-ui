<template>
<v-card class="elevation-12">
  <v-toolbar flat>
    <v-btn icon @click="$emit('exit', true)">
      <font-awesome-icon icon="arrow-left" />
    </v-btn>
    <v-toolbar-title>
      👋 Co słychać {{username}}?
    </v-toolbar-title>
  </v-toolbar>
  <v-card-text>
    Jesteś już zalogowany. Zaczynasz naukę, czy na dzisiaj koniec? ;-)
  </v-card-text>
  <v-divider />
  <v-card-actions class="py-4 px-8 d-flex justify-end">
    <v-btn rounded large block
      color="primary"
      class="px-4"
      @click="handleLogout"
    >
      Wyloguj się
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import { mapState } from 'vuex';
import { onLogout } from '../../vue-apollo';

export default {
  name: 'user-form',
  computed: {
    ...mapState({
      username: state => state.application.user.name,
    }),
  },
  methods: {
    handleLogout() {
      onLogout(this.$apollo.provider.defaultClient);
      this.$store.commit('SET_APPLICATION_USER', { id: null });
    },
  },
};
</script>

<style>

</style>
