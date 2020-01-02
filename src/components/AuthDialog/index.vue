<template>
<v-dialog persistent
  v-model="modal"
  max-width="460px"
>
  <v-card class="elevation-12">
  <v-tabs :value="currentTab" :height=0>
    <v-tab-item>
      <guest-form @exit="modal = false"/>
    </v-tab-item>
    <v-tab-item>
      <user-form @exit="modal = false"/>
    </v-tab-item>
  </v-tabs>
  </v-card>
</v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import GuestForm from './guestForm.vue';
import UserForm from './userForm.vue';

export default {
  name: 'auth-modal',
  components: { GuestForm, UserForm },
  props: ['value'],
  computed: {
    ...mapState({
      isLoggedIn: state => !!state.application.user && !!state.application.user.id,
    }),
    modal: {
      get() { return this.value; },
      set(val) { this.$emit('input', val); },
    },
    currentTab() {
      return this.isLoggedIn ? 1 : 0;
    },
  },
};
</script>

<style>

</style>
