<template>
  <q-page class="flex flex-center">
    <div class="q-py-sm full-width" >
     <q-list>
<div class="row justify-center align-center">
<div v-for="(rating, index) in masterRatings" :key="index" class="col-12 col-sm-6 col-lg-4">
      <q-expansion-item expand-icon-class="hidden">
        <template v-slot:header>
            <q-item-section>
              <q-item-label class="text-h6">{{ rating.name }}</q-item-label>
              <q-item-label class="text-subtitle1 text-grey-8">{{
                rating.platform
              }}</q-item-label>
            </q-item-section>
            
            <q-space />

            <q-item-section top side>
            <q-item-label>
                <q-rating
        v-model="rating.roundedRating"
        max="5"
        size="1.8em"
        color="primary"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
        readonly
      />
      </q-item-label>
              <q-item-label class="text-subtitle1">({{ rating.ratings.length }}) &nbsp;&nbsp;{{
                rating.roundedRating
              }}</q-item-label>
            </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
            commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
            eveniet doloribus ullam aliquid.
          </q-card-section>
        </q-card>
      </q-expansion-item>
         
          <q-separator spaced inset />
        </div>
      </q-list>
      </div>
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
