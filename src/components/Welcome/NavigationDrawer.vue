<template>
  <v-navigation-drawer
    absolute
    expand-on-hover
    class="primary"
  >
      <v-list dense nav style="margin-top: 180px;">
        <v-list-item-group mandatory :value="activeItemId">
          <nav-list-item
            v-for="(item, i) in items"
            :key="i"
            :item="item"
            :disabled="!currentUser"
            @click="() => changeCateogryTo(item.category)"
          ></nav-list-item>
        </v-list-item-group>

        <v-divider class="my-2"></v-divider>

          <nav-list-item v-if="!currentUser"
            :item="{
              icon: 'mdi-power',
              text: 'Zaloguj się',
            }"
            @click="() => openAuthDialog()"
          ></nav-list-item>
          <nav-list-item v-else
            :item="{
              icon: 'mdi-power',
              text: 'Wyloguj się',
            }"
            @click="logOut"
          ></nav-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import * as R from 'ramda';
import { currentUser } from '../../api/queries';
import NavListItem from './Atoms/NavListItem.vue';
import { onLogout } from '../../vue-apollo';

export default {
  apollo: { currentUser },
  name: 'welcome-nav-drawer',
  components: { NavListItem },
  props: ['category'],
  data() {
    return {
      currentUser: null,
      items: [
        {
          category: 'all',
          text: 'Wszystkie utwory',
          icon: 'mdi-file-multiple-outline',
        },
        {
          category: 'favourite',
          text: 'Ulubione',
          icon: 'mdi-heart',
        },
        {
          category: 'private',
          text: 'Moje utwory',
          icon: 'mdi-file-music-outline',
        },
      ],
    };
  },
  computed: {
    activeItemId() {
      return R.findIndex(R.propEq('category', this.category), this.items);
    },
  },
  methods: {
    changeCateogryTo(category) {
      this.$router.push({
        name: 'home',
        params: { category },
      }).catch(console.error);
    },
    openAuthDialog() {
      this.$store.commit('SET_APPLICATION_AUTH_DIALOG', true);
    },
    logOut() {
      onLogout(this.$apollo.provider.defaultClient);
    },
  },
};
</script>
