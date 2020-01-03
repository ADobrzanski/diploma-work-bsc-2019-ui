<template>
  <v-btn rounded flat
    class="px-4"
    :min-width=100
    :elevation=0
    :loading="$apollo.queries.currentUser.loading"
    color="accent"
    @click="$emit('click', true)" >
    <font-awesome-icon :icon="icon" class="mr-2" />
    {{text}}
</v-btn>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import gql from 'graphql-tag';
import { currentUser } from '../api/queries';

export default {
  name: 'user-chip',
  data() {
    return { user: null };
  },
  computed: {
    icon() {
      return this.currentUser ? 'user-circle' : 'key';
    },
    text() {
      console.log(this.currentUser);
      return this.currentUser ? this.currentUser.name : 'Zaloguj się!';
    },
  },
  apollo: {
    currentUser,
  },
};
</script>
