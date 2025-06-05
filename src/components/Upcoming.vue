<template>
  <div class="bg-[#030816] pt-10">
    <!-- <p class="text-white text-3xl font-bold">Популярные</p> -->
    <div class="flex items-center justify-center">
      <swiper
        :modules="modules"
        :slides-per-view="slidesPerView"
        :centered-slides="true"
        :space-between="30"
        :loop="true"
        :breakpoints="breakpoints"
        effect="coverflow"
        :mousewheel="{
          sensitivity: 1,
          forceToAxis: true,
          releaseOnEdges: true,
        }"
        :coverflow-effect="{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
        class="mySwiper w-full max-w-full"
      >
        <swiper-slide
          v-for="movie in movies"
          :key="movie.id"
          class="cursor-pointer movie-card"
          @click="goToMovie(movie.id)"
        >
          <div
            class="rounded-xl overflow-hidden shadow-xl transition-transform duration-300"
          >
            <img
              :src="getBackdropUrl(movie.poster_path)"
              :alt="movie.title"
              class="w-[900px] h-[500px] object-cover"
              loading="lazy"
            />
            <!-- <div
              class="movie-overlay bg-black bg-opacity-75 absolute bottom-0 left-0 right-0 p-4"
            >
              <div class="flex items-center mt-2">
                <div class="font-semibold">
                  {{ formatYear(movie.release_date) }}
                </div>
              </div>
              <h3 class="text-lg font-bold text-center text-white">{{ movie.title }}</h3>
            </div> -->
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div v-if="loading" class="text-center py-4">Loading...</div>
    <div v-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
  </div>
  <div class="bg-[#030816] py-10 text-center text-white text-4xl font-medium">
    Мы предлагаем вам нашу коллекцию. <br />Находите свои любимые фильмы в одном месте,
    <br />с лучшим качеством
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  Navigation,
  Pagination,
  Mousewheel,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import 'swiper/css/effect-coverflow';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const router = useRouter();
const API = {
  KEY: import.meta.env.VITE_API_KEY,
  TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  ACCOUNT_ID: import.meta.env.VITE_ACCOUNT_ID,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const movies = ref([]);
const loading = ref(false);
const error = ref(null);

const modules = [Navigation, Pagination, Mousewheel, Autoplay, EffectCoverflow];
const slidesPerView = 5;
const breakpoints = {
  320: { slidesPerView: 1 },
  640: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
};

const getPosterUrl = (posterPath) => {
  return posterPath
    ? `${API.IMAGE_BASE_URL}${posterPath}`
    : "/images/qwer.webp";
};

const getBackdropUrl = (backdropPath) => {
  return backdropPath
    ? `${API.IMAGE_BASE_URL}${backdropPath}`
    : "/images/qwer.webp";
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
    const url = `${API.BASE_URL}/movie/upcoming?language=ru-RU&page=1`;
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

.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}
</style>
