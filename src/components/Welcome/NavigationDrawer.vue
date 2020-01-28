<template>
  <v-navigation-drawer
    absolute
    expand-on-hover
    class="primary"
  >
      <v-list dense nav style="margin-top: 180px;">
        <v-list-item-group mandatory>
          <v-list-item
            v-for="(item, i) in items"
            :key=i
          >
            <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{item.text}}
              </v-list-item-title>
            </v-list-item-content>

          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
  name: 'welcome-nav-drawer',
  data() {
    return {
      items: [
        { text: 'Wszystkie utwory', icon: 'mdi-file-multiple-outline' },
        { text: 'Ostatnio otwierane', icon: 'mdi-history' },
        { text: 'Ulubione', icon: 'mdi-heart' },
        { text: 'Moje utwory', icon: 'mdi-file-music-outline' },
      ],
    };
  },
};
</script>
