<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="glossy">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          BingeWorthy
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="200"
      content-class="bg-grey-1"
    >
      <q-list class="q-py-md">
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
        </q-item> -->

        <q-item to="/signin" v-show="!userAuth">
          <q-item-section avatar>
            <q-icon name="how_to_reg" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sign In</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/signup" v-show="!userAuth">
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

        <q-item to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            <q-item-label>All Ratings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/ratings" v-show="userAuth">
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>

          <q-item-section>
            <q-item-label>My Ratings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/recent">
          <q-item-section avatar>
            <q-icon name="access_time" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Recent Ratings</q-item-label>
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
      searchBar: false,
      leftDrawerOpen: false,
    };
  },
  methods: {
    onLogout() {
      if (confirm("Sign Out?")) {
        this.$store.dispatch("store/logout");
        this.search = "";
        this.leftDrawerOpen = !this.leftDrawerOpen;
      }
    },
  },
  computed: {
    userAuth() {
      return (
        this.$store.state.store.user !== null &&
        this.$store.state.store.user !== undefined
      );
    },
  },
  watch: {
    searchBar() {
      this.$store.commit("store/searchBarToggle");
    },
  },
  created() {
    // fetching events from firebase
    this.$store.dispatch("store/loadRatings");
    // log returning users in automatically
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch("store/autoSignIn", user);
      }
    });
  },
};
</script>
