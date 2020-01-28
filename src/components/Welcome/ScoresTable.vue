<template>
<v-container class="ma-0 pa-0">

  <v-data-table
    :headers="headers"
    :items="items"
    hide-default-footer
    class="elevation-2"
    @click:row="payload => $emit('click:row', payload)"
  >

    <template v-slot:item.favourite="{ item }">
      <v-btn icon @click.prevent="$emit('click:favourite', item)">
        <v-icon>{{item.favourite ? 'mdi-heart' : 'mdi-heart-outline'}}</v-icon>
      </v-btn>
    </template>

  </v-data-table>

  <v-pagination
    circle
    :value="paging.page"
    :length="paging.pagesTotal"
    class="mt-4"
  ></v-pagination>

</v-container>
</template>

<script>

export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    paging: {
      type: Object,
      default: () => ({
        page: 1,
        pagesTotal: 1,
      }),
    },
  },
  data() {
    return {
      headers: [
        {
          text: '',
          value: 'favourite',
          sortable: false,
        },
        {
          text: 'Tytuł',
          value: 'title',
          sortable: false,
        },
        {
          text: 'Podtytuł',
          value: 'subtitle',
          sortable: false,
        },
        {
          text: 'Kompozytor',
          value: 'composer',
          sortable: false,
        },
        {
          text: 'Autor tekstu',
          value: 'lyricist',
          sortable: false,
        },
      ],
    };
  },
};
</script>
