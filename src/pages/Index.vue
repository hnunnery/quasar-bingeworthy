<template>
  <q-page class="flex flex-center">
    <div class="q-pa-sm">
      <q-list>
        <div v-for="(rating, index) in masterRatings" :key="index">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6">{{ rating.name }}</q-item-label>
              <q-item-label class="text-subtitle1">{{
                rating.platform
              }}</q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div
                class="text-primary"
                style="font-size: 1.5em; margin-top: -5px;"
              >
                <q-icon name="star" />
                <q-icon name="star" />
                <q-icon name="star" />
                <q-icon name="star" />
              </div>
              <q-item-label class="text-subtitle1">{{
                rating.roundedRating
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator spaced inset />
        </div>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageIndex",
  computed: {
    masterRatings() {
      return this.$store.state.store.masterRatings;
    },
  },
};
</script>
