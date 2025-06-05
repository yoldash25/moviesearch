<template>
  <div
    class="pt-10 fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center text-white"
  >
    <div
      class="bg-black/40 backdrop-blur-none w-screen max-h-screen overflow-y-auto relative"
    >
      <button
        class="bg-black rounded-full absolute pb-2 w-6 h-6 top-10 right-2 z-10"
        @click="router.back()"
      >
        ×
      </button>
      <MovieHeader
        :movie="movie"
        :is-favorite="isFavorite"
        :image-base-url="API.IMAGE_ORIGI_URL"
        @toggle-favorite="toggleFavorite"
      />

      <div>
        <ActorsCast
          :cast="cast"
          :director="director"
          :image-base-url="API.IMAGE_BASE_URL"
          @select-actor="openActorModal"
        />

        <MovieTrailer
          :trailer-id="trailer"
          :production-companies="movie.production_companies"
          :image-base-url="API.IMAGE_BASE_URL"
        />
      </div>
      <!--rekomendasiya -->
      <RecomentationMovies
        :recommendations="recommendations"
        :image-base-url="API.IMAGE_BASE_URL"
        @select-movie="goToMovie"
      />
      <Teleport to="body">
        <ActorModal
          v-if="showActorModal"
          :actor-id="selectedActorId"
          @close="showActorModal = false"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieHeader from "./MovieHeader.vue";
import RecomentationMovies from "./RecomentationMovies.vue";
import ActorsCast from "./ActorsCast.vue";
import MovieTrailer from "./MovieTrailer.vue";

import ActorModal from "./ActorModal.vue";
const showActorModal = ref(false);
const selectedActorId = ref(false);

const openActorModal = (actorId) => {
  selectedActorId.value = actorId;
  showActorModal.value = true;
};

const router = useRouter();
const route = useRoute();
const movie = ref({});
const cast = ref([]);
const director = ref(null);
const trailer = ref(null);
const isFavorite = ref(false);
const recommendations = ref([]);

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  ACCOUNT_ID: import.meta.env.VITE_ACCOUNT_ID,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
  IMAGE_ORIGI_URL: import.meta.env.VITE_IMAGE_ORIGI_URL,
};

const goToMovie = (movieId) => {
  window.location.href = `/movie/${movieId}`;
};

const fetchRecommendations = async () => {
  try {
    const url = `${API.BASE_URL}/movie/${route.params.id}/recommendations?api_key=${API.KEY}&language=ru-RU&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    recommendations.value = data.results;
  } catch (error) {
    console.error("Ошибка при загрузке рекомендаций:", error);
    recommendations.value = [];
  }
};

const fetchAllFavoritePages = async () => {
  try {
    let allFavorites = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const url = `${API.BASE_URL}/account/${API.ACCOUNT_ID}/favorite/movies?language=ru-RU&page=${page}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API.TOKEN}`,
        },
      };

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();

      allFavorites = [...allFavorites, ...data.results];
      hasMorePages = page < data.total_pages;
      page++;
    }

    return allFavorites;
  } catch (error) {
    console.error("Error fetching all favorites:", error);
    return [];
  }
};

const toggleFavorite = async () => {
  try {
    const url = `${API.BASE_URL}/account/${API.ACCOUNT_ID}/favorite`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API.TOKEN}`,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: movie.value.id,
        favorite: !isFavorite.value,
      }),
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Ошибка при обновлении избранного");

    isFavorite.value = !isFavorite.value;
  } catch (error) {
    console.error("Ошибка toggleFavorite:", error);
  }
};

let originalOverflow = "";
onMounted(async () => {
  const id = route.params.id;
  originalOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  try {
    const response = await fetch(
      `${API.BASE_URL}/movie/${id}?api_key=${API.KEY}&language=ru-RU`
    );
    movie.value = await response.json();

    const creditsRes = await fetch(
      `${API.BASE_URL}/movie/${id}/credits?api_key=${API.KEY}&language=ru-RU`
    );
    const creditsData = await creditsRes.json();
    cast.value = creditsData.cast;
    director.value = creditsData.crew.find((person) => person.job === "Director");

    const videosRes = await fetch(
      `${API.BASE_URL}/movie/${id}/videos?api_key=${API.KEY}&language=ru-RU`
    );
    const videosData = await videosRes.json();
    const officialTrailer = videosData.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    trailer.value = officialTrailer?.key || null;

    await fetchRecommendations();

    const allFavorites = await fetchAllFavoritePages();
    isFavorite.value = allFavorites.some((f) => f.id === movie.value.id);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
});

onUnmounted(() => {
  document.body.style.overflow = originalOverflow;
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* o aktyore */
.actor-modal-enter-active,
.actor-modal-leave-active {
  transition: opacity 0.3s ease;
}

.actor-modal-enter-from,
.actor-modal-leave-to {
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
