<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="min-height: 48px;">
        <q-btn flat round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title class="text-weight-bold text-italic" style="letter-spacing: -1px;">
          <router-link to="/" style="text-decoration: none !important; color: inherit;">BingeWorthy</router-link>
        </q-toolbar-title>

        <div>{{ userName }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="200">
      <q-list class="q-py-md">
        <div class="flex flex-center full-width q-my-md">
          <q-img
            src="https://res.cloudinary.com/missionwebdev/image/upload/c_scale,f_auto,w_70/v1586282035/BingeWorthy/garnet-gold.png"
            spinner-color="primary"
            style="width: 70px"
          />
        </div>

        <!-- <q-item
          clickable
          @click="
            searchBar = !searchBar;
            leftDrawerOpen = !leftDrawerOpen;
          "
        >
          <q-item-section avatar>
            <q-icon name="search" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Search</q-item-label>
          </q-item-section>
        </q-item>-->

        <q-item :to="{ name: 'Home' }" active-class="none" active-color="secondary">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>All Ratings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/ratings" v-show="userAuth" active-color="secondary">
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>
          <q-item-section>
            <q-item-label>My Ratings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/recent" active-color="secondary">
          <q-item-section avatar>
            <q-icon name="access_time" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Recent Ratings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/addrating" v-show="userAuth" active-color="secondary">
          <q-item-section avatar>
            <q-icon name="add_circle_outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Add A Rating</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/signin" v-show="!userAuth" active-color="secondary">
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sign In</q-item-label>
          </q-item-section>
        </q-item>

        <q-item to="/signup" v-show="!userAuth" active-color="secondary">
          <q-item-section avatar>
            <q-icon name="person_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sign Up</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="onLogout" v-show="userAuth">
          <q-item-section avatar>
            <q-icon name="directions_walk" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sign Out</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="absolute-bottom q-mb-xl">
          <q-item-section avatar class="q-mx-auto">
            <q-btn-toggle
              v-model="dark"
              push
              :options="[
          {value: false, slot: 'one'},
          {value: true, slot: 'two'}
        ]"
            >
              <template v-slot:one>
                <div class="row items-center no-wrap">
                  <q-icon name="brightness_5" />
                </div>
              </template>

              <template v-slot:two>
                <div class="row items-center no-wrap">
                  <q-icon name="brightness_3" />
                </div>
              </template>
            </q-btn-toggle>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { auth } from "boot/firebase";

export default {
  name: "MainLayout",
  data() {
    return {
      dark: true,
      userName: "",
      searchBar: false,
      leftDrawerOpen: false
    };
  },
  methods: {
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("store/logout");
        this.search = "";
        this.leftDrawerOpen = !this.leftDrawerOpen;
      }
    }
  },
  computed: {
    userAuth() {
      return (
        this.$store.state.store.user !== null &&
        this.$store.state.store.user !== undefined
      );
    },
    userDark() {
      return this.$store.state.store.userDark;
    },
    userHasName() {
      if (this.userAuth) {
        return this.$store.state.store.user.name;
      }
    }
  },
  watch: {
    dark() {
      this.$q.dark.set(this.dark);
      this.$store.dispatch("store/saveUserDark", this.dark);
    },
    userDark() {
      this.$q.dark.set(this.userDark);
      this.dark = this.userDark;
    },
    userHasName() {
      this.userName = this.userHasName;
    },
    searchBar() {
      this.$store.commit("store/searchBarToggle");
    }
  },
  created() {
    this.$q.dark.set(true);
    // fetching events from firebase
    this.$store.dispatch("store/loadRatings");
    // log returning users in automatically
    auth.onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("store/autoSignIn", user);
      }
    });
  }
};
</script>
