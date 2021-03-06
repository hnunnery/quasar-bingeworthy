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
              <q-item-section>
                <q-item-label class="text-h6">{{ rating.name }}</q-item-label>
                <q-item-label
                  class="text-subtitle1 text-grey-7"
                >{{ rating.rank }}&nbsp; - &nbsp;{{ rating.platform }}</q-item-label>
              </q-item-section>

              <q-btn
                round
                dense
                flat
                class="absolute-center"
                icon="expand_more"
                style="margin-top: 30px; opacity: .2;"
              />

              <q-space />

              <q-item-section top side>
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
                <q-item-label class="text-subtitle1 text-bold q-pr-xs q-mt-sm">
                  <span
                    class="text-grey-7 text-weight-regular"
                  >{{ rating.ratings.length }} Ratings -</span>
                  {{
                  rating.roundedRating.toFixed(2)
                  }}
                </q-item-label>
              </q-item-section>
            </template>

            <q-card>
              <q-card-section class="q-py-sm q-px-none">
                <div class="row justify-center align-center">
                  <div class="col-7 flex flex-center">
                    <span
                      @click="sendShowName(rating.name)"
                      :class="{ 'text-bold': true, 'text-subtitle1': true, 'text-secondary': darkMode }"
                      style="cursor: pointer;"
                    >See Individual Ratings</span>
                  </div>
                  <q-space />
                  <RateThis
                    v-if="userAuth"
                    :rateName="rating.name"
                    :ratePlatform="rating.platform"
                  />
                  <div v-else class="col-5 text-center q-pr-sm">
                    <q-btn
                      ripple
                      to="signin"
                      color="primary"
                      size="1.15em"
                      label="Rate This"
                      class="text-capitalize q-px-xs"
                    />
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
import RateThis from "components/RateThis";

export default {
  name: "Home",
  components: {
    RateThis
  },
  computed: {
    masterRatings() {
      return this.$store.state.store.masterRatings;
    },
    userAuth() {
      return this.$store.state.store.user;
    },
    loading() {
      return this.masterRatings.length < 30;
    },
    darkMode() {
      return this.$q.dark.isActive;
    }
  },
  methods: {
    sendShowName(showName) {
      this.$store.commit("store/setShowName", showName);
      this.$router.push("show");
    }
  }
};
</script>
