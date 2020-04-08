
<template>
  <div>
    <!-- button for auth users -->
    <div class="col-5 q-mr-lg">
      <q-btn
        v-if="userAuth"
        ripple
        color="primary"
        size="1.15em"
        label="Rate This"
        class="text-capitalize q-px-xs"
        @click="dialog=true"
      />
      <!-- if not auth -->
      <q-btn
        v-if="!userAuth"
        ripple
        color="primary"
        size="1.15em"
        label="Rate This"
        class="text-capitalize q-px-xs"
        to="/signin"
      />
    </div>
    <!-- button for not auth users -->
    <q-dialog v-model="dialog" transition-show="scale" transition-hide="scale">
      <q-card class="text-center flex flex-center" style="width: 100%; max-width: 500px;">
        <q-card-section>
          <div class="text-h4 text-italic text-secondary q-mt-md q-pb-none">{{ rateName }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-mt-sm text-h3 text-secondary">{{ rating }}/5</div>
          <div class="q-mt-sm q-mb-sm">
            <q-rating
              v-model="rawRating"
              max="10"
              size="1.9em"
              color="secondary"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
            ></q-rating>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-mb-lg">
          <q-btn
            ripple
            color="primary"
            size="1.2em"
            class="q-mx-sm q-px-sm text-capitalize"
            label="Add Rating"
            @click="addRating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { db } from "boot/firebase";

export default {
  props: ["rateName", "ratePlatform"],
  data() {
    return {
      name: this.rateName,
      platform: this.ratePlatform,
      rating: 0,
      user: this.$store.state.store.user.name,
      search: "",
      rawRating: 0,
      dialog: false,
      duplicate: false
    };
  },
  computed: {
    uniqueNames() {
      let a = [];
      this.$store.state.store.names.map(x => {
        if (!a.includes(x)) {
          a.push(x);
        }
      });
      return a;
    },
    uniquePlatforms() {
      let a = [];
      this.$store.state.store.platforms.map(x => {
        if (!a.includes(x)) {
          a.push(x);
        }
      });
      return a;
    },
    ratings() {
      return this.$store.state.store.ratings;
    },
    userRatings() {
      return this.$store.state.store.userRatings;
    },
    userAuth() {
      return this.$store.state.store.user;
    }
  },
  methods: {
    addRating() {
      this.duplicate = false;
      this.userRatings.forEach(rating => {
        if (this.name === rating.name) {
          this.duplicate = true;
        }
      });
      // saving data to firestore
      if (
        this.name &&
        this.platform &&
        this.rating &&
        this.user &&
        !this.duplicate
      ) {
        const newRating = {
          name: this.name,
          platform: this.platform,
          rating: this.rating,
          user: this.user,
          userId: this.$store.state.store.user.id,
          date: new Date()
        };
        db.collection("show")
          .add(newRating)
          .then(docRef => {
            this.name = "";
            this.platform = "";
            this.rating = 0;
            this.dialog = false;
            this.$q.notify({
              type: "positive",
              message: "Rating Added!",
              icon: "check_circle_outline"
            });
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else {
        alert("Please complete all fields.");
      }
    },
    resetForm() {
      this.name = "";
      this.platform = "";
      this.rating = 0;
      this.rawRating = 0;
      this.user = "";
      this.dialog = false;
    },
    setName(val) {
      this.name = val;
    },
    setPlatform(val) {
      this.platform = val;
    }
  },
  watch: {
    name() {
      if (this.name !== undefined && this.name !== null) {
        this.ratings.forEach(rating => {
          if (this.name === rating.name) {
            this.platform = rating.platform;
          }
        });
      }
    },
    rawRating() {
      this.rating = this.rawRating / 2;
    }
  }
};
</script>
