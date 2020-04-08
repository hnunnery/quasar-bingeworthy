import { db, auth } from "boot/firebase";

const state = () => ({
  user: null,
  userDark: true,
  ratings: [],
  masterRatings: [],
  userRatings: [],
  recentRatings: [],
  showName: "",
  names: [],
  platforms: [],
  error: null,
  searchBar: false
});

// MUTATIONS

const mutations = {
  setLoadedRatings(state, payload) {
    state.ratings = payload;
    state.names = state.ratings.map(rating => rating.name);
    state.platforms = state.ratings.map(rating => rating.platform);
  },
  setMasterRatings(state, payload) {
    state.masterRatings = payload;
  },
  setUserRatings(state, payload) {
    state.userRatings = payload;
  },
  setShowName(state, payload) {
    state.showName = payload;
  },
  setRecentRatings(state, payload) {
    state.recentRatings = payload;
  },
  addRating(state, payload) {
    state.ratings.push(payload);
    state.ratings.sort((a, b) => (a.rating < b.rating ? 1 : -1));
  },
  deleteRating(state, payload) {
    state.ratings = state.ratings.filter(rating => rating.id !== payload);
  },
  updateRating(state, payload) {
    state.ratings.forEach(rating => {
      if (rating.id === payload.id) {
        rating.name = payload.name;
        rating.rating = payload.rating;
        rating.platform = payload.platform;
        rating.user = payload.user;
      }
    });
    state.ratings.sort((a, b) => (a.rating < b.rating ? 1 : -1));
  },
  clearRatings(state) {
    state.ratings = [];
  },
  setError(state, payload) {
    state.error = payload;
  },
  clearError(state) {
    state.error = null;
  },
  searchBarToggle(state) {
    state.searchBar = !state.searchBar;
  },
  // USER HANDLING
  setUser(state, payload) {
    state.user = payload;
  },
  setUserDark(state, payload) {
    state.userDark = payload;
  },
  updateUserName(state, payload) {
    state.user.name = payload;
  }
};

// ACTIONS

const actions = {
  loadRatings({ commit, dispatch }) {
    let ratings = [];
    db.collection("show")
      .orderBy("rating", "desc")
      .onSnapshot(querySnapshot => {
        let changes = querySnapshot.docChanges();
        changes.forEach(change => {
          if (change.type == "added") {
            let rating = change.doc.data();
            rating.id = change.doc.id;
            ratings.push(rating);
            commit("setLoadedRatings", ratings);
            dispatch("createMasterRatings");
            dispatch("createUserRatings");
          } else if (change.type == "removed") {
            commit("deleteRating", change.doc.id);
            dispatch("createMasterRatings");
            dispatch("createUserRatings");
          }
        });
      });
  },
  createMasterRatings({ commit, state }) {
    let tempMaster = [];
    let nameList = [];
    state.names.map(x => {
      if (!nameList.includes(x)) {
        nameList.push(x);
      }
    });
    nameList.forEach(name => {
      let obj = {};
      obj.name = name;
      obj.platform = "";
      obj.ratings = [];
      obj.users = [];
      state.ratings.forEach(rating => {
        if (rating.name === name) {
          obj.platform = rating.platform;
          obj.ratings.push(rating.rating);
          obj.users.push(rating.user);
        }
      });
      tempMaster.push(obj);
    });
    tempMaster.forEach(rating => {
      let averageRating = parseFloat(
        rating.ratings.reduce((a, b) => a + b, 0) / rating.ratings.length
      );
      // CURRENT WEIGTHING PER RATING IS .01
      let weight = rating.ratings.length * 0.01;
      rating.averageRating = averageRating + weight;
    });
    const master = tempMaster.filter(rating => rating.ratings.length > 1);
    master.sort((a, b) => (a.averageRating < b.averageRating ? 1 : -1));
    master.forEach(rating => {
      rating.rank = master.indexOf(rating) + 1;
      rating.roundedRating = parseFloat(rating.averageRating.toFixed(2));
    });
    // ROUNDING DOWN TO NEAREST .5 TO CONTROL VUETIFY RATING COMPONENT
    master.forEach(rating => {
      rating.averageRating = Math.floor(rating.averageRating * 2) / 2;
    });

    // COMMIT TO MUTATION AND STATE
    commit("setMasterRatings", master);
  },
  createUserRatings({ commit, state }) {
    if (state.user) {
      const newList = [];
      state.ratings.forEach(rating => {
        if (rating.userId === state.user.id) {
          newList.push(rating);
        }
      });

      // COMMIT TO MUTATION AND STATE
      commit("setUserRatings", newList);
    }
  },
  createRecentRatings({ commit }) {
    let ratings = [];
    db.collection("show")
      .orderBy("date", "desc")
      .limit(30)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let rating = doc.data();
          rating.id = doc.id;
          ratings.push(rating);
        });
      });

    // COMMIT TO MUTATION AND STATE
    commit("setRecentRatings", ratings);
  },
  // USER HANDLING
  signUserUp({ commit }, payload) {
    commit("clearError");
    auth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        auth.currentUser
          .updateProfile({
            displayName: payload.displayName
          })
          .then(function() {
            console.log("Updated Display Name");
            commit("updateUserName", payload.displayName);
          });
      })
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  signUserIn({ commit }, payload) {
    commit("clearError");
    auth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  autoSignIn({ commit, dispatch }, payload) {
    if (!payload.displayName) {
      this.$router.push("/updatename");
    } else {
      this.$router.push("/");
    }
    db.collection("users")
      .doc(payload.uid)
      .get()
      .then(querySnapshot => {
        commit("setUserDark", querySnapshot.data().dark);
      });
    commit("setUser", {
      id: payload.uid,
      name: payload.displayName
    });
    dispatch("createUserRatings");
  },
  updateDisplayName({ commit }, payload) {
    commit("clearError");
    const router = this.$router;
    auth.currentUser
      .updateProfile({
        displayName: payload
      })
      .then(function() {
        commit("updateUserName", payload);
        router.push("/");
      })
      .catch(error => {
        commit("setError", error);
        console.log(error);
      });
  },
  saveUserDark({ state }, payload) {
    let userId = state.user.id;
    db.collection("users")
      .doc(userId)
      .set({
        dark: payload
      })
      .then(docRef => {
        console.log(`Dark Mode set to ${payload}`);
      });
  },
  logout({ commit }) {
    auth.signOut();
    commit("setUser", null);
    this.$router.push("/");
  }
};

const getters = {
  error(state) {
    return state.error;
  }
};

export default {
  namespaced: true,
  strict: false,
  state,
  mutations,
  actions,
  getters
};
