<template>
  <q-page class="flex flex-center">
    <q-spinner-gears color="primary" size="7em" v-if="loading" />
    <q-list v-else>
      <div class="row align-center q-py-md q-px-none full-width">
        <div
          class="col-12 col-md-6 col-lg-4 q-px-none"
          v-for="(rating, index) in masterRatings"
          :key="index"
        >
          <q-expansion-item expand-icon-class="hidden">
            <template v-slot:header>
              <q-item-section
                side
                class="text-secondary text-center"
                style="font-size: 1.6em; margin: 0px -5px;"
              >{{ rating.rank }}</q-item-section>

              <q-item-section>
                <q-item-label class="text-h6">{{ rating.name }}</q-item-label>
                <q-item-label class="text-subtitle2 text-grey-7">{{ rating.platform }}</q-item-label>
              </q-item-section>

              <q-space />

              <q-item-section top side style="margin:0px -5px 0px -16px;">
                <q-item-label>
                  <q-rating
                    v-model="rating.roundedRating"
                    size="1.8em"
                    color="secondary"
                    icon="star_border"
                    icon-selected="star"
                    icon-half="star_half"
                    readonly
                  />
                </q-item-label>
                <q-item-label class="text-overline q-pr-xs q-mt-xs">
                  <span class="text-weight-regular">{{ rating.ratings.length }} Ratings -</span>
                  {{
                  rating.roundedRating.toFixed(2)
                  }}
                </q-item-label>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section>
                <div class="row justify-center align-center">
                  <div class="col-7">
                    <q-btn
                      flat
                      to="show"
                      @click="sendShowName(rating.name)"
                      label="See Ratings for this Show"
                      class="text-capitalize"
                    ></q-btn>
                  </div>
                  <div class="col-5 text-right q-pr-xs">
                    <q-btn color="primary" label="Rate This" class="text-capitalize" />
                  </div>
                </div>
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
export default {
  name: "Home",
  computed: {
    masterRatings() {
      return this.$store.state.store.masterRatings;
    },
    loading() {
      return this.masterRatings.length < 30;
    }
  },
  methods: {
    sendShowName(showName) {
      this.$store.commit("store/setShowName", showName);
    }
  }
};
</script>
