
<template>
  <div>
    <!-- button for auth users -->
    <div class="col-4 text-right q-pr-sm">
      <q-btn color="primary" label="Rate This" class="text-capitalize" @click="dialog=true" />
    </div>
    <!-- button for not auth users -->
    <q-dialog v-model="dialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="text-center" style="width: 80vw; max-width: 500px;">
        <q-card-section>
          <div class="text-h6 q-mt-sm q-pb-none">Add Your Rating</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-mb-md">
            <q-select
              v-model="name"
              @input-value="setName"
              label="Name of Show"
              :options="this.uniqueNames"
              clearable
              options-dense
              use-input
              hide-selected
              fill-input
              hide-dropdown-icon
              input-debounce="0"
              new-value-mode="add"
              style="width: 250px"
              behavior="menu"
            ></q-select>
          </div>
          <div class="q-my-md">
            <q-select
              v-model="platform"
              @input-value="setPlatform"
              label="Platform"
              :options="this.uniquePlatforms"
              clearable
              options-dense
              use-input
              hide-selected
              fill-input
              hide-dropdown-icon
              input-debounce="0"
              style="width: 250px"
              behavior="menu"
            ></q-select>
          </div>
          <div class="q-mt-lg text-h3 text-secondary">{{ rating }}/5</div>
          <div class="q-mt-sm q-mb-md">
            <q-rating
              v-model="rawRating"
              max="10"
              size="1.6em"
              color="secondary"
              icon="star_border"
              icon-selected="star"
              icon-half="star_half"
            ></q-rating>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-mb-md">
          <q-btn flat class="q-mx-sm" label="Cancel" @click="resetForm" />
          <q-btn color="primary" class="q-mx-sm" label="Add Rating" @click="addRating" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>


<script>
import { db } from "boot/firebase";

export default {
  data() {
    return {
      name: "",
      rating: 0,
      platform: "",
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
