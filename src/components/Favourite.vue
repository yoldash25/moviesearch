<template>
  <div class="bg-[#040714] min-h-screen">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="loader"></div>
    </div>
    <div
      v-else
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-16 px-16 pb-16"
    >
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @select="fetchMovieDetails"
      />
    </div>
    <!-- pagination -->
    <div
      v-if="movies.length > 0"
      class="flex justify-center items-center gap-2 mt-8 pb-8 flex-wrap"
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
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, watch, onMounted } from "vue";
import MovieCard from "./MovieCard.vue";

const route = useRoute();
const router = useRouter();
const movies = ref([]);
const loading = ref(false);
const totalPages = ref(1);
const currentPage = computed(() => parseInt(route.query.page) || 1);

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  ACCOUNT_ID: import.meta.env.VITE_ACCOUNT_ID,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const fetchMovieDetails = async (movieId) => {
  try {
    router.push(`/movie/${movieId}`);
  } catch (error) {
    console.error("Error navigating to movie details:", error);
  }
};

const fetchFavouriteStatus = async () => {
  loading.value = true;
  try {
    const url = `${API.BASE_URL}/account/${API.ACCOUNT_ID}/favorite/movies?language=ru-RU&page=${currentPage.value}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API.TOKEN}`,
      },
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch favorites");
    }
    const data = await res.json();
    const allFavorites = await fetchAllFavorites();

    movies.value = data.results.map((movie) => ({
      ...movie,
      isFavorite: allFavorites.some((fav) => fav.id === movie.id),
    }));

    totalPages.value = data.total_pages || 1;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    movies.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchAllFavorites = async () => {
  try {
    const url = `${API.BASE_URL}/account/${API.ACCOUNT_ID}/favorite/movies?language=ru-RU`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${API.TOKEN}`,
      },
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Failed to fetch all favorites");
    }
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching all favorites:", error);
    return [];
  }
};

watch(currentPage, async () => {
  await fetchFavouriteStatus();
});

onMounted(async () => {
  await fetchFavouriteStatus();
});

const query = computed(() => route.query.q || "");
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
</script>

<style scoped>
.loader {
  width: 60px;
  aspect-ratio: 2;
  --_g: no-repeat radial-gradient(circle closest-side, #ffffff 90%, #0000);
  background: var(--_g) 0% 50%, var(--_g) 50% 50%, var(--_g) 100% 50%;
  background-size: calc(100% / 3) 50%;
  animation: l3 1s infinite linear;
}
@keyframes l3 {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }
  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }
  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }
  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
}
</style>
