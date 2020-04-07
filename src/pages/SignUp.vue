<template>
  <q-page class="flex flex-center">
    <q-card class="q-ma-sm q-pa-lg text-center" style="width: 100%; max-width: 500px;">
      <h2 class="text-h4 q-my-md">Sign Up for Account</h2>
      <q-input v-model="displayName" label="Full Name" class="q-my-lg" />
      <q-input v-model="email" label="Email" class="q-my-lg" />
      <q-input v-model="password" label="Password" class="q-my-lg" />
      <q-btn class="q-mt-sm" color="primary" label="Sign Up" />
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      displayName: "",
      email: "",
      password: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.store.user;
    }
    // error() {
    //   return this.$store.state.error;
    // }
  },
  methods: {
    onSignUp() {
      this.$store.dispatch("store/signUserUp", {
        email: this.email,
        password: this.password,
        displayName: this.displayName
      });
    }
    // onDismissed() {
    //   this.$store.dispatch("clearError");
    // }
  }
};
</script>
