<template>
<v-card class="elevation-12">
  <v-toolbar flat>
    <v-btn icon @click="$emit('exit', true)">
      <font-awesome-icon icon="arrow-left" />
    </v-btn>
    <v-toolbar-title>
      👋 Co słychać {{user ? user.name : ''}}?
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
import { currentUser } from '../../api/queries';
import { onLogout } from '../../vue-apollo';

export default {
  name: 'user-form',
  apollo: { user: currentUser },
  data() { return { user: null }; },
  methods: {
    handleLogout() {
      onLogout(this.$apollo.provider.defaultClient);
    },
  },
};
</script>

<style>

</style>
