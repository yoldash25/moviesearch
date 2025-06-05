<template>
  <div class="">
    <div class="container mx-auto bg-gradient-to-b">
      <div class="relative">
        <SearchBar @search="handleSearch" />
      </div>

      <Loader v-if="loading" />

      <div
        v-if="movies.length != 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
      >
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @select="fetchMovieDetails"
        />
      </div>
      <div v-if="movies.length === 0 && !loading" class="text-center mt-10">
        <img
          v-if="query.trim()"
          src="../../public/images/7af30a35.webp"
          alt=""
          class="relative mx-auto w-[50%] h-[50%] -z-10"
        />
        <div v-if="error" class="text-white text-center">{{ error }}</div>
      </div>
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-2 mt-8 mb-10 flex-wrap"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          &laquo;
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded border',
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-600 font-bold'
              : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { searchMovies, getMovieDetails } from "../api";
import SearchBar from "../components/SearchBar.vue";
import MovieCard from "../components/MovieCard.vue";
import Loader from "../components/Loader.vue";

const route = useRoute();
const router = useRouter();
const query = computed(() => route.query.q || "");
const currentPage = computed(() => parseInt(route.query.page) || 1);
const movies = ref([]);
const loading = ref(false);
const error = ref("");
const totalPages = ref(1);
const selectedMovie = ref(null);

const fetchMovieDetails = async (id) => {
  try {
    selectedMovie.value = await getMovieDetails(id);
  } catch (err) {
    console.error("Ошибка при загрузке деталей фильма", err);
  }
};

const handleSearch = async () => {
  if (!query.value.trim()) {
    movies.value = [];
    totalPages.value = 1;
    error.value = "";
    return;
  }

  loading.value = true;
  error.value = "";
  movies.value = [];

  try {
    const data = await searchMovies(query.value, currentPage.value);

    movies.value = data.results;
    totalPages.value = data.total_pages;

    if (data.results.length === 0) {
      error.value = "Фильм не найден.";
    }
  } catch {
    error.value = "Ошибка при загрузке.";
  } finally {
    loading.value = false;
  }
};

watch([query, currentPage], handleSearch, { immediate: true });

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  router.push({
    path: route.path,
    query: {
      q: query.value.trim(),
      page,
    },
  });
};

const maxVisiblePages = 5;
const visiblePages = computed(() => {
  const pages = [];
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(currentPage.value - half, 1);
  let end = Math.min(start + maxVisiblePages - 1, totalPages.value);
  if (end - start < maxVisiblePages - 1) {
    start = Math.max(end - maxVisiblePages + 1, 1);
  }
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const handleKeyPress = (e) => {
  if (e.key === 'Escape') {
    router.back();
  } else if (e.key === 'ArrowLeft' && currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  } else if (e.key === 'ArrowRight' && currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>
