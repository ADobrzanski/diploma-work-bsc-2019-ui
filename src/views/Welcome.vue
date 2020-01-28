<template>
  <div class="layout-grid">
    <navigation-drawer :expanded="true"/>
    <div class="main">
        <div class="font-weight-thin text-left pa-2 mt-8 headline">Czego nauczysz się dzisiaj?</div>
        <v-text-field
          append-icon="mdi-magnify"
          class="font display-1 font-weight-thin">
        </v-text-field>

        <v-spacer></v-spacer>

        <scores-table
          :items="scores"/>
    </div>
  </div>
</template>

<script>
import NavigationDrawer from '../components/Welcome/NavigationDrawer.vue';
import ScoresTable from '../components/Welcome/ScoresTable.vue';

export default {
  components: {
    'navigation-drawer': NavigationDrawer,
    ScoresTable,
  },
  data() {
    return {
      scores: [
        {
          id: 1,
          title: 'Balbabli',
          subtitle: 'pumpum',
          composer: 'Me and Friends',
          lyricis: 'Also me, but alone',
        },
        {
          id: 2,
          title: 'Balbabli',
          lyricis: 'Also me, but alone',
          favourite: true,
        },
        {
          id: 3,
          title: 'Balbabli',
          subtitle: 'pumpum',
          composer: 'Me and Friends',
          lyricis: 'Also me, but alone',
        },
      ],
    };
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
