<template>
  <q-page class="flex flex-center">
    <q-spinner-gears color="primary" size="7em" v-if="loading" />
    <q-list v-else>
      <div class="row justify-center align-center q-py-md full-width">
        <div class="col-12 col-sm-6 col-lg-4" v-for="(rating, index) in userRatings" :key="index">
          <q-expansion-item expand-icon-class="hidden">
            <template v-slot:header>
              <q-item-section>
                <q-item-label class="text-h6">{{ rating.name }}</q-item-label>
                <q-item-label class="text-subtitle1 text-grey-7">
                  {{
                  rating.platform
                  }}
                </q-item-label>
              </q-item-section>

              <q-space />

              <q-item-section top side>
                <q-item-label>
                  <q-rating
                    v-model="rating.rating"
                    size="1.8em"
                    color="secondary"
                    icon="star_border"
                    icon-selected="star"
                    icon-half="star_half"
                    readonly
                  />
                </q-item-label>
                <q-item-label class="text-subtitle1 q-pr-xs">
                  {{
                  rating.user
                  }}
                </q-item-label>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="flex flex-center">
                <q-btn
                  @click="removeRating(rating.id)"
                  class="text-capitalize text-body1 q-mx-md q-pr-xs"
                  color="primary"
                  label="Delete"
                  icon="delete"
                />
                <EditRating :rating="rating" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-separator spaced />
        </div>
      </div>
    </q-list>
  </q-page>
</template>

<script>
import { db } from "boot/firebase";
import EditRating from "components/EditRating";

export default {
  name: "Ratings",
  components: {
    EditRating
  },
  computed: {
    userRatings() {
      return this.$store.state.store.userRatings;
    },
    loading() {
      return this.userRatings.length < 1;
    }
  },
  methods: {
    removeRating(id) {
      if (confirm("Delete this rating")) {
        db.collection("show")
          .doc(id)
          .delete()
          .then(() => {
            this.$q.notify({
              type: "positive",
              message: "Rating Deleted!",
              icon: "check_circle_outline"
            });
          });
      }
    }
  }
};
</script>
