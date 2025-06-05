<template>
  <div class="relative mt-6 mx-auto w-full max-w-7xl">
    <!-- Trailer Section -->
    <div v-if="trailerId">
      <p class="font-semibold mb-2">Трейлер:</p>
      <iframe
        class="rounded mx-auto"
        :class="{
          'sm:w-[600px] sm:h-[350px]': true,
          'md:w-[800px] md:h-[450px]': true,
          'lg:w-[1000px] lg:h-[600px]': true,
          'xl:w-[1280px] xl:h-[720px]': true
        }"
        :src="`https://www.youtube.com/embed/${trailerId}`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>
    </div>

    <!-- Production Companies Section -->
    <div v-if="productionCompanies?.length" class="flex gap-4 justify-center my-10">
      <div 
        v-for="company in productionCompanies" 
        :key="company.id" 
        class="mt-10 bg-white rounded-lg p-4 hover:scale-105 transition-all duration-300"
      >
        <img
          v-if="company.logo_path"
          :src="`${imageBaseUrl}${company.logo_path}`"
          :alt="company.name"
          class="w-[200px] h-[80px] object-contain"
        />
        <p v-else class="text-black text-center py-4">{{ company.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  trailerId: {
    type: String,
    default: ''
  },
  productionCompanies: {
    type: Array,
    default: () => []
  },
  imageBaseUrl: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.company-logo {
  filter: brightness(0) invert(1);
}
</style>