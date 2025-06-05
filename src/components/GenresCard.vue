<template>
  <div class="bg-[#030816] p-4 max-w-full mx-auto text-white">
    <h1 class="text-3xl font-bold mb-6">Фильмы по жанрам</h1>
    <div v-for="(genre, genreIdx) in genresWithMovies" :key="genre.id" class="mb-10">
      <nav
        class="text-2xl font-semibold mb-4 cursor-pointer hover:text-blue-500 transition-colors"
        @click="router.push({ name: 'GenreMovies', params: { id: genre.id } })"
      >
        {{ genre.name }}
      </nav>
      <div class="relative max-w-full">
        <div
          v-if="activeIndexes[genreIdx] !== 0"
          class="absolute -left-7 -top-5 h-[110%] w-24 z-10 pointer-events-none blur-side"
        ></div>
        <div
          v-if="activeIndexes[genreIdx] < 12"
          class="absolute -right-4 -top-5 h-[110%] w-24 z-10 pointer-events-none blur-side-right"
        ></div>
        <swiper
          :modules="modules"
          :slides-per-view="slidesPerView"
          :space-between="10"
          :breakpoints="breakpoints"
          :mousewheel="{
            sensitivity: 3,
            forceToAxis: true,
            releaseOnEdges: true,
          }"
          :speed="400"
          @slideChange="onSlideChange($event, genreIdx)"
          @swiper="onSwiper($event, genreIdx)"
        >
          <swiper-slide
            v-for="movie in genre.movies"
            :key="movie.id"
            class="cursor-pointer movie-card"
            @click="goToMovie(movie.id)"
          >
            <div class="relative hover:scale-110">
              <img
                :src="
                  movie.poster_path
                    ? `${API.IMAGE_BASE_URL}${movie.poster_path}`
                    : 'https://via.placeholder.com/300x450?text=Нет+постера'
                "
                :alt="movie.title"
                class="rounded-lg w-full object-cover"
              />
              <div class="group movie-overlay">
                <div class="flex items-center justify-between mt-2">
                  <!-- <span class="text-yellow-400"
                    >★ {{ movie.vote_average?.toFixed(1) }}</span
                  > -->
                  <div class="font-semibold absolute top-2 left-2 z-30">
                    {{
                      movie.release_date ? movie.release_date.slice(0, 4) : "Неизвестно"
                    }}
                  </div>
                </div>
                <h3 class="text-lg font-bold text-center truncate">{{ movie.title }}</h3>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
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

const router = useRouter();

const genresList = [
  { id: 28, name: "Боевик" },
  { id: 12, name: "Приключения" },
  { id: 16, name: "Анимация" },
  { id: 35, name: "Комедия" },
  { id: 80, name: "Криминал" },
  { id: 99, name: "Документальный" },
  { id: 18, name: "Драма" },
  { id: 10751, name: "Семья" },
  { id: 14, name: "Фэнтези" },
  { id: 36, name: "История" },
  { id: 27, name: "Ужасы" },
  { id: 10402, name: "Музыка" },
  { id: 9648, name: "Мистерия" },
  { id: 10749, name: "Романтика" },
  { id: 878, name: "Научная" },
  { id: 10770, name: "ТВ-фильм" },
  { id: 53, name: "Триллер" },
  { id: 10752, name: "Война" },
  { id: 37, name: "Вестерн" },
];

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  ACCOUNT_ID: import.meta.env.VITE_ACCOUNT_ID,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const genresWithMovies = ref([]);
const modules = [Navigation, Pagination, Mousewheel];
const breakpoints = {
  320: { slidesPerView: 1, spaceBetween: 10 },
  576: { slidesPerView: 2, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 15 },
  768: { slidesPerView: 4, spaceBetween: 20 },
  992: { slidesPerView: 5, spaceBetween: 20 },
  1024: { slidesPerView: 6, spaceBetween: 20 },
  1440: { slidesPerView: 8, spaceBetween: 25 },
};

const slidesPerView = 5;
const activeIndexes = ref([]);

async function fetchMoviesByGenre(genreId) {
  try {
    const url = `${API.BASE_URL}/discover/movie?api_key=${API.KEY}&with_genres=${genreId}&language=ru-RU&page=1`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Ошибка загрузки фильмов:", error);
    return [];
  }
}

onMounted(async () => {
  const promises = genresList.map(async (genre) => {
    const movies = await fetchMoviesByGenre(genre.id);
    return { ...genre, movies };
  });
  genresWithMovies.value = await Promise.all(promises);
  activeIndexes.value = genresWithMovies.value.map(() => 0);
});

const swipers = ref([]);

function onSwiper(swiper, genreIdx) {
  swipers.value[genreIdx] = swiper;
}

function onSlideChange(swiper, genreIdx) {
  activeIndexes.value[genreIdx] = swiper.activeIndex;
}

function goToMovie(id) {
  router.push({ name: "MovieModal", params: { id } });
}
</script>

<style scoped>
.blur-side {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.95) 60%, rgba(0, 0, 0, 0));
  filter: blur(6px);
}
.blur-side-right {
  background: linear-gradient(to left, rgba(3, 8, 22, 0.95) 60%, rgba(3, 8, 22, 0));
  filter: blur(6px);
}
.movie-card {
  position: relative;
}

.movie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 0 0 0.5rem 0.5rem;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}
</style>
