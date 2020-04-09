<template>
  <div class="flex flex-center" style="height: 70vh;">
    <q-card class="q-ma-sm q-pa-lg text-center" style="width: 100%; max-width: 500px;">
      <form @submit.prevent="onSignUp">
        <h2 class="text-h4 q-my-md">Sign Up for Account</h2>
        <q-input v-model="displayName" label="Full Name" class="q-my-lg" />
        <q-input v-model="email" label="Email" class="q-my-lg" />
        <q-input v-model="password" label="Password" class="q-my-lg" />
        <div v-if="error">
          <Alert :text="error.message" />
        </div>
        <q-btn
          ripple
          type="submit"
          class="q-my-md text-capitalize q-px-sm"
          color="primary"
          size="1.2em"
          label="Sign Up"
        />
      </form>
    </q-card>
  </div>
</template>

<script>
import Alert from "components/Alert";

export default {
  components: {
    Alert
  },
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
    },
    error() {
      return this.$store.state.store.error;
    }
  },
  methods: {
    onSignUp() {
      this.$store.dispatch("store/signUserUp", {
        email: this.email,
        password: this.password,
        displayName: this.displayName
      });
    }
  }
};
</script>
