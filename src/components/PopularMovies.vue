<template>
  <div class="bg-[#030816]">
    <p class="text-white text-3xl font-bold">Популярные</p>
    <div class="relative max-w-full">
      <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :space-between="10"
        :breakpoints="breakpoints"
        :mousewheel="{
          sensitivity: 1,
          forceToAxis: true,
          releaseOnEdges: true,
        }"
      >
        <swiper-slide
          v-for="movie in movies"
          :key="movie.id"
          class="cursor-pointer movie-card"
          @click="goToMovie(movie.id)"
        >
          <div class="relative hover:scale-110 transition-transform duration-300">
            <img
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
              class="rounded-lg w-full object-cover"
              loading="lazy"
            />
            <div
              class="movie-overlay bg-black bg-opacity-75 absolute bottom-0 left-0 right-0 p-4"
            >
              <!-- <div class="flex items-center justify-between"> -->
                <!-- <span class="text-yellow-400"
                  >★ {{ formatRating(movie.vote_average) }}</span
                > -->
                <div class="font-semibold">
                  {{ formatYear(movie.release_date) }}
                </div>
              <!-- </div> -->
              <h3 class="text-lg font-bold text-center text-white">{{ movie.title }}</h3>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div v-if="loading">
      <div class="loader"></div>
    </div>
    <div v-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  ACCOUNT_ID: import.meta.env.VITE_ACCOUNT_ID,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const router = useRouter();
const movies = ref([]);
const loading = ref(false);
const error = ref(null);

// Swiper configuration
const modules = [Navigation, Pagination, Mousewheel];
const slidesPerView = 6;
const breakpoints = {
  320: { slidesPerView: 1 },
  480: { slidesPerView: 2 },
  640: { slidesPerView: 3 },
  768: { slidesPerView: 4 },
  1024: { slidesPerView: 5 },
  1280: { slidesPerView: 6 },
};

// Helper functions
const getPosterUrl = (posterPath) => {
  return posterPath
    ? `${API.IMAGE_BASE_URL}${posterPath}`
    : "https://via.placeholder.com/300x450?text=Нет+постера";
};

const formatYear = (date) => {
  return date ? date.slice(0, 4) : "Неизвестно";
};

const goToMovie = (movieId) => {
  router.push({
    name: "MovieModal",
    params: { id: movieId },
  });
};

const fetchPopularMovies = async () => {
  loading.value = true;
  error.value = null;

  try {
    const url = `${API.BASE_URL}/movie/popular?language=ru-RU&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API.TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }

    const data = await response.json();
    movies.value = data.results;
  } catch (err) {
    console.error("Error fetching popular movies:", err);
    error.value = "Failed to load popular movies";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPopularMovies();
});
</script>

<style scoped>
.movie-card {
  transition: transform 0.3s ease;
}

.movie-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.swiper {
  padding: 20px 0;
}
</style>
