/* eslint-disable no-extra-boolean-cast */
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
        😁 Nieźle {{ currentUser ? currentUser.name : ''}}, nowe wyzwanie?
      </v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-alert dense text dismissible
        v-model="alertVisible"
        :type="alertType"
      >
        {{alertMessage}}
      </v-alert>
      Chciałbyś, żebyśmy przechowali to dla Ciebie w ☁️ chmurze,
      żeby utwór dostępny był na wszystkich urządzeniach?
    </v-card-text>
    <v-divider />

    <v-card-actions class="py-4 px-8 d-flex justify-around">
      <v-btn rounded large
        color="primary"
        class="px-4"
        @click="uploadScore"
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
import { currentUser } from '../api/queries';
import { uploadScore as upload } from '../api/mutations';

export default {
  name: 'upload-dialog',
  apollo: { currentUser },
  props: ['value', 'file', 'scoreDetails'],
  data() {
    return {
      currentUser: null,
      alertVisible: false,
      success: true,
    };
  },
  computed: {
    dialog: {
      get() { return this.value; },
      set(input) { this.$emit('input', input); },
    },
    alertMessage() {
      return this.success
        ? 'Konto utworzono pomyślnie! 🎉'
        : 'Coś poszło nie tak 😵';
    },
    alertType() {
      return this.success
        ? 'success'
        : 'error';
    },
  },
  methods: {
    uploadScore() {
      this.$apollo.mutate(upload(
        this.scoreDetails,
        this.file,
      )).then(() => {
        this.showAlertSuccess();
      }).catch((error) => {
        this.showAlertError();
        console.error(error);
      });
    },
    showAlertError() {
      this.success = false;
      this.alertVisible = true;
    },
    showAlertSuccess() {
      this.success = true;
      this.alertVisible = true;
    },
  },
};
</script>
