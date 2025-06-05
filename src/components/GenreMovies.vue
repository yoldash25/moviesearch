<template>
  <div class="bg-[#030816] min-h-screen p-4 text-white">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <button
          @click="router.back()"
          class="bg-gray-800 p-2 rounded-full hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-3xl font-bold">{{ genreName }}</h1>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-[60vh]">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
        ></div>
      </div>

      <div v-else-if="error" class="text-center text-red-500 text-xl">
        {{ error }}
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
      >
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="cursor-pointer hover:scale-105 transition-transform duration-300"
          @click="goToMovie(movie.id)"
        >
          <div class="relative">
            <img
              :src="
                movie.poster_path
                  ? `${API.IMAGE_BASE_URL}${movie.poster_path}`
                  : '/images/qwer.webp'
              "
              :alt="movie.title"
              class="w-full h-[300px] object-cover rounded-lg"
            />
            <div
              class="absolute top-0 left-0 right-0 z-10 p-2 flex items-center justify-between"
            >
              <span class="text-right text-md px-2 py-1 rounded text-white">
                {{
                  movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : "Неизвестно"
                }}
              </span>
            </div>
            <div
              class="hover:bg-gray-800/50 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
            >
              <h3 class=" text-lg font-bold truncate text-white">{{ movie.title }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoadingScroll" class="flex justify-center items-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const movies = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const currentPage = ref(1);
const hasMorePages = ref(true);
const isLoadingScroll = ref(false);

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const genresList = {
  28: "Боевик",
  12: "Приключения",
  16: "Анимация",
  35: "Комедия",
  80: "Криминал",
  99: "Документальный",
  18: "Драма",
  10751: "Семейный",
  14: "Фэнтези",
  36: "История",
  27: "Ужасы",
  10402: "Музыка",
  9648: "Мистерия",
  10749: "Романтика",
  878: "Научная фантастика",
  10770: "ТВ-фильм",
  53: "Триллер",
  10752: "Военный",
  37: "Вестерн",
};

const genreName = computed(() => {
  return genresList[route.params.id] || "Жанр не найден";
});

const fetchMovies = async (page = 1) => {
  try {
    const url = `${API.BASE_URL}/discover/movie?api_key=${API.KEY}&with_genres=${route.params.id}&language=ru-RU&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Ошибка загрузки фильмов");
    const data = await res.json();

    if (page === 1) {
      movies.value = data.results;
    } else {
      movies.value = [...movies.value, ...data.results];
    }

    hasMorePages.value = data.page < data.total_pages;
    currentPage.value = data.page;
  } catch (err) {
    error.value = err.message;
  }
};
const handleScroll = async () => {
  if (isLoadingScroll.value || !hasMorePages.value) return;

  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.offsetHeight;

  // Load more when user is near bottom (100px threshold)
  if (documentHeight - scrollPosition < 100) {
    isLoadingScroll.value = true;
    await fetchMovies(currentPage.value + 1);
    isLoadingScroll.value = false;
  }
};

const goToMovie = (id) => {
  router.push({ name: "MovieModal", params: { id } });
};

onMounted(async () => {
  loading.value = true;
  await fetchMovies();
  loading.value = false;

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);
});
</script>
