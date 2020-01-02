<template>
<v-card >
  <v-toolbar flat>
    <v-btn icon @click="$emit('exit', true)">
      <font-awesome-icon icon="arrow-left" />
    </v-btn>
    <v-toolbar-title>
      👋 Witaj z powrotem!
    </v-toolbar-title>
  </v-toolbar>
  <v-card-text>
    <v-form
      class="pa-4">
      <v-alert dense text dismissible
        v-model="alertVisible"
        :type="alertType"
      >
        {{alertMessage}}
      </v-alert>
      <v-text-field
        v-model="login"
        label="Login"
        name="login"
        type="text"
        outlined
        hide-details
      />

      <v-text-field
        v-if="modeRegister"
        v-model="email"
        class="mt-4"
        label="Email"
        name="email"
        type="text"
        outlined
        hide-details
      />

      <v-text-field
        v-model="password"
        class="mt-4"
        label="Password"
        name="password"
        type="password"
        outlined
        hide-details
      />

      <v-text-field
        v-if="modeRegister"
        v-model="repassword"
        class="mt-4"
        label="Repeat password"
        name="password"
        type="password"
        outlined
        hide-details
      />
    </v-form>

    <v-btn
      color="blue"
      @click="toggleMode"
      text block
    >
      {{toggleModeBtnText}}
    </v-btn>
  </v-card-text>
  <v-divider />
  <v-card-actions class="py-4 px-8 d-flex justify-end">
    <v-btn rounded large
      color="primary"
      class="px-4"
      @click="handleSubmit"
    >
      {{loginRegisterBtnText}}
    </v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import gql from 'graphql-tag';
import { onLogin } from '../../vue-apollo';

export default {
  name: 'guest-form',
  data() {
    return {
      modeRegister: false,
      success: true,
      alertVisible: false,
      login: '',
      email: '',
      password: '',
      repassword: '',
    };
  },
  computed: {
    toggleModeBtnText() {
      return !this.modeRegister
        ? 'Nie mam jeszcze konta :-('
        : 'Mam już konto ;-)';
    },
    loginRegisterBtnText() {
      return !this.modeRegister
        ? 'Zaloguj'
        : 'Zarejestruj';
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
    toggleMode() {
      this.modeRegister = !this.modeRegister;
    },
    handleSubmit() {
      if (this.modeRegister) {
        this.signUp();
      } else {
        this.signIn();
      }
    },
    signUp() {
      const {
        login,
        email,
        password,
        repassword,
      } = this;

      if (password !== repassword) {
        console.error('Passwords don`t match');
        this.showAlertError();
        return;
      }
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation ($name: String! $email: String! $password: String!) {
          register(name: $name email: $email password: $password) {
            id
            name
            email
          }
        }`,
        // Parameters
        variables: {
          name: login,
          email,
          password,
        },
      }).then(() => {
        this.clearForm();
        this.toggleMode();
        this.showAlertSuccess();
      }).catch((error) => {
        this.showAlertError();
        console.error(error);
      });
    },
    signIn() {
      const {
        login,
        password,
      } = this;

      this.$apollo.mutate({
        // Query
        mutation: gql`mutation ($name: String! $password: String!) {
          login(name: $name password: $password) {
            user {
              id
              name
              email
            }
            token
          }
        }`,
        // Parameters
        variables: {
          name: login,
          password,
        },
      }).then((data) => {
        const { user, token } = data.data.login;
        onLogin(this.$apollo.provider.defaultClient, token);
        this.$store.commit('SET_APPLICATION_USER', user);
      }).catch((error) => {
        this.showAlertError();
        console.error(error);
      });
    },
    clearForm() {
      this.login = '';
      this.email = '';
      this.password = '';
      this.repassword = '';
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

<style>

</style>
