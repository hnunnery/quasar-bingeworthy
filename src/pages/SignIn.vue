<template>
  <div class="flex flex-center" style="height: 70vh;">
    <q-card class="q-ma-sm q-pa-lg text-center" style="width: 100%; max-width: 500px;">
      <form @submit.prevent="onSignIn">
        <h2 class="text-h4 q-my-md">Sign In Here</h2>
        <q-input v-model="email" label="Email" type="email" class="q-my-lg" />
        <q-input v-model="password" label="Password" type="password" class="q-my-lg" />
        <q-btn
          ripple
          type="submit"
          class="q-my-md text-capitalize q-px-sm"
          color="primary"
          size="1.2em"
          label="Sign In"
        />
        <div v-if="error">
          <Alert :text="error.message" />
        </div>
        <div>
          <q-btn
            flat
            to="signup"
            @click="clearError"
            class="text-capitalize q-mt-sm"
            label="Create Account Here"
          />
        </div>
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
    onSignIn() {
      this.$store.dispatch("store/signUserIn", {
        email: this.email,
        password: this.password
      });
    },
    clearError() {
      this.$store.commit("store/clearError");
    }
  }
};
</script>
