<template>
  <div class="flex flex-center" style="height: 75vh;">
    <q-card class="q-ma-sm text-center" style="width: 100%; max-width: 500px;">
      <q-card-section class="full-width">
        <div
          :class="{ 'text-h4': true, 'text-italic': true, 'text-secondary': darkMode,  'q-mt-md': true, 'q-mb-sm': true }"
        >Add Your Rating</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mb-lg q-pb-sm flex flex-center">
          <q-select
            v-model="name"
            @input-value="setName"
            label="Name of Show"
            :options="nameOptions"
            @filter="filterNames"
            clearable
            options-dense
            use-input
            hide-selected
            fill-input
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add"
            style="width: 90%;"
            behavior="menu"
          ></q-select>
        </div>
        <div class="q-mb-lg flex flex-center">
          <q-select
            v-model="platform"
            @input-value="setPlatform"
            label="Platform"
            :options="platformOptions"
            @filter="filterPlatforms"
            clearable
            options-dense
            use-input
            hide-selected
            fill-input
            hide-dropdown-icon
            input-debounce="0"
            style="width: 90%;"
            behavior="menu"
          ></q-select>
        </div>
        <div
          :class="{ 'q-mt-lg': true, 'q-pt-sm': true, 'text-h3': true, 'text-secondary': darkMode }"
        >{{ rating }}/5</div>
        <div class="q-my-md">
          <q-rating
            v-model="rawRating"
            max="10"
            size="2em"
            :color="starColor"
            color-selected="secondary"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
          ></q-rating>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="q-mb-lg q-pb-md">
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
      duplicate: false,
      nameOptions: this.uniqueNames,
      platformOptions: this.uniquePlatforms
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
      return this.$store.getters["store/userRatings"];
    },
    darkMode() {
      return this.$q.dark.isActive;
    },
    starColor() {
      if (this.darkMode) {
        return "secondary";
      } else {
        return "primary";
      }
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
            this.rawRating = 0;
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
    },
    filterNames(val, update) {
      if (val === "") {
        update(() => {
          this.nameOptions = this.uniqueNames;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.nameOptions = this.uniqueNames.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterPlatforms(val, update) {
      if (val === "") {
        update(() => {
          this.platformOptions = this.uniquePlatforms;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.platformOptions = this.uniquePlatforms.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
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
