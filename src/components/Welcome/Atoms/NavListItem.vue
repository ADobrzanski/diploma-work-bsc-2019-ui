<template>
  <v-list-item
    @click="$emit('click')"
    :disabled="disabled"
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
</template>

<script>
export default {
  props: ['item', 'disabled'],
};
</script>
