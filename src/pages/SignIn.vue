<template>
  <q-page class="flex flex-center">
    <q-card
      class="q-ma-sm q-pa-lg text-center"
      style="width: 100%; max-width: 500px;"
    >
      <h2 class="text-h4 q-my-md">Sign In Here</h2>
      <q-input v-model="email" label="Email" class="q-my-lg" />
      <q-input v-model="password" label="Password" class="q-my-lg" />
      <q-btn
        @click="onSignIn"
        class="glossy q-mt-sm"
        color="primary"
        label="Sign In"
      />
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.store.user;
    },
    // error() {
    //   return this.$store.getters.error;
    // }
  },
  methods: {
    onSignIn() {
      this.$store.dispatch("store/signUserIn", {
        email: this.email,
        password: this.password,
      });
    },
    // onDismissed() {
    //   this.$store.dispatch("clearError");
    // }
  },
};
</script>
