<template>
  <q-page class="flex flex-center">
    <q-spinner-gears color="primary" size="7em" v-if="loading" />
    <q-list v-else>
      <div class="row justify-center align-center q-py-md full-width">
        <div class="col-12 col-sm-6 col-lg-4" v-for="(rating, index) in recentRatings" :key="index">
          <q-item>
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
          </q-item>
          <q-separator spaced />
        </div>
      </div>
    </q-list>
  </q-page>
</template>

<script>
export default {
  name: "Recent",
  computed: {
    recentRatings() {
      return this.$store.state.store.recentRatings;
    },
    loading() {
      return this.recentRatings.length < 1;
    }
  }
};
</script>
