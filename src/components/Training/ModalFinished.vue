<template>
  <v-dialog
    :value="visible"
    max-width="360"
  >
    <v-card>
      <v-card-title class="headline">
        🎉 Świetna robota!
      </v-card-title>
      <v-card-text class="subtitle-1 text-left">
        Udało Ci się ukończyć trening!
        Co dalej?
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onRepeat">
          💪 JESZCZ RAZ!
        </v-btn>
        <v-btn
          outlined
          @click="onExit">🥱 WYJŚCIE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'modal-training-finished',
  props: [
    'visible',
    'onRepeat',
    'onExit',
  ],
};
</script>

<style>

</style>
