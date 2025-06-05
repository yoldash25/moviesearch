<template>
  <!-- <Banner /> -->
  <Upcoming />
  <Many />
  <PopularMovies />
  <Footer />
</template>

<script setup>
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Banner from "../components/Banner.vue";
import Footer from "../components/Footer.vue";
import Many from "../components/Many.vue";
import PopularMovies from "../components/PopularMovies.vue";
import Upcoming from "../components/Upcoming.vue";

</script>

<style scoped>

</style>
