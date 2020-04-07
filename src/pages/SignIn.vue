<template>
  <q-page class="flex flex-center">
    <q-card
      class="q-ma-sm q-pa-lg text-center"
      style="width: 100%; max-width: 500px;"
    >
      <form @submit.prevent="onSignIn">
        <h2 class="text-h4 q-my-md">Sign In Here</h2>
        <q-input v-model="email" label="Email" type="email" class="q-my-lg" />
        <q-input
          v-model="password"
          label="Password"
          type="password"
          class="q-my-lg"
        />
        <q-btn
          ripple
          type="submit"
          class="q-my-md text-capitalize q-px-sm"
          color="primary"
          size="1.2em"
          label="Sign In"
        />
        <div>
          <q-btn
            flat
            to="signup"
            class="text-capitalize q-mt-sm"
            label="Create Account Here"
          />
        </div>
      </form>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
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
    onSignIn() {
      this.$store.dispatch("store/signUserIn", {
        email: this.email,
        password: this.password
      });
    }
    // onDismissed() {
    //   this.$store.dispatch("clearError");
    // }
  }
};
</script>
