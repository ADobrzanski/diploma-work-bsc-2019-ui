<template>
  <v-chip color="accent" @click="$emit('click', true)" >
    <font-awesome-icon :icon="icon" class="mr-2" />
    {{text}}
  </v-chip>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'user-chip',
  computed: {
    ...mapState({
      username: (state) => {
        if (
          !!state.application.user
          && !!state.application.user.id
        ) {
          return state.application.user.name;
        }

        return null;
      },
    }),
    icon() {
      return this.username ? 'user-circle' : 'key';
    },
    text() {
      return this.username || 'Zaloguj się!';
    },
  },
};
</script>
