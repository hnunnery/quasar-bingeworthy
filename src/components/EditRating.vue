<template>
  <div>
    <div class="flex flex-center">
      <q-btn
        class="text-capitalize text-body1 q-mx-md q-pl-sm q-pr-md"
        color="primary"
        label="Edit"
        icon="edit"
        @click="dialog=true"
      />
    </div>

    <q-dialog v-model="dialog" transition-show="scale" transition-hide="scale">
      <q-card class="text-center flex flex-center" style="width: 100%; max-width: 450px;">
        <q-card-section class="full-width">
          <div
            :class="{ 'text-h4': true, 'text-italic': true, 'text-secondary': darkMode,  'q-mt-md': true, 'q-mb-sm': true }"
          >Edit {{ originalName }}</div>
        </q-card-section>

        <q-card-section class="full-width q-pt-none" style="max-width: 350px;">
          <div class="q-mb-lg flex flex-center">
            <q-select
              v-model="updatedName"
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
              style="width: 100%;"
              behavior="menu"
            ></q-select>
          </div>
          <div class="q-mb-lg flex flex-center">
            <q-select
              v-model="updatedPlatform"
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
              style="width: 100%;"
              behavior="menu"
            ></q-select>
          </div>
          <div
            :class="{ 'q-mt-lg': true, 'text-h3': true, 'text-bold': !darkMode, 'text-secondary': darkMode }"
          >{{ updatedRating }}/5</div>
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
        <q-card-section align="center" class="q-mb-lg">
          <q-btn
            ripple
            color="primary"
            size="1.2em"
            class="q-mx-sm q-px-sm text-capitalize"
            label="Update Rating"
            @click="updateRating"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { db } from "boot/firebase";

export default {
  props: ["rating"],
  data() {
    return {
      originalName: this.rating.name,
      updatedName: this.rating.name,
      rawRating: parseFloat(this.rating.rating * 2),
      updatedPlatform: this.rating.platform,
      updatedUser: this.rating.user,
      ratingId: this.rating.id,
      dialog: false,
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
    userRatings() {
      return this.$store.state.store.userRatings;
    },
    updatedRating() {
      return this.rawRating / 2;
    },
    darkMode() {
      return this.$q.dark.isActive;
    }
  },
  methods: {
    updateRating() {
      this.duplicate = false;
      this.userRatings.forEach(rating => {
        if (
          this.updatedName === rating.name &&
          this.updatedName !== this.originalName
        ) {
          this.duplicate = true;
        }
      });
      // saving data to firestore
      if (
        this.updatedName &&
        this.updatedPlatform &&
        this.updatedRating &&
        this.updatedUser &&
        !this.duplicate
      ) {
        const updatedObject = {
          name: this.updatedName,
          rating: this.updatedRating,
          platform: this.updatedPlatform,
          user: this.updatedUser,
          id: this.ratingId
        };
        db.collection("show")
          .doc(this.ratingId)
          .update({
            name: this.updatedName,
            rating: this.updatedRating,
            platform: this.updatedPlatform,
            user: this.updatedUser
          })
          .then(() => {
            this.$store.commit("store/updateRating", updatedObject);
            this.dialog = false;
            this.$q.notify({
              type: "positive",
              message: "Rating Updated!",
              icon: "check_circle_outline"
            });
          });
      } else if (this.duplicate) {
        alert(
          "You have already rated this show. Please edit your existing rating instead."
        );
      } else alert("Please complete all fields.");
    },
    setName(val) {
      this.updatedName = val;
    },
    setPlatform(val) {
      this.updatedPlatform = val;
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
  }
};
</script>