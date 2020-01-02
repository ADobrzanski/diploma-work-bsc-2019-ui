<template>
<v-dialog
  v-model="dialog"
  max-width="460px"
>
  <v-card class="elevation-12">

    <v-toolbar flat>
      <v-btn icon @click="dialog = false">
        <font-awesome-icon icon="arrow-left" />
      </v-btn>
      <v-toolbar-title>
        😁 Nieźle {{username}}, nowe wyzwanie?
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      Chciałbyś, żebyśmy przechowali to dla Ciebie w ☁️ chmurze,
      żeby utwór dostępny był na wszystkich urządzeniach?
    </v-card-text>
    <v-divider />

    <v-card-actions class="py-4 px-8 d-flex justify-around">
      <v-btn rounded large
        color="primary"
        class="px-4"
        @click="dialog = false"
      >
        ☁ Chmura!
      </v-btn>

      <v-btn rounded large
        color="primary"
        class="px-4"
        @click="dialog = false"
      >
        🤔 Może później
      </v-btn>
    </v-card-actions>

  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'upload-dialog',
  props: ['value'],
  computed: {
    dialog: {
      get() { return this.value; },
      set(input) { this.$emit('input', input); },
    },
  },
  methods: {
    uploadScore() {

    },
  },
};
</script>
