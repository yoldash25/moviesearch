<template>
  <div
    class="fixed inset-0 bg-black/90 flex items-start justify-center z-50 p-4 overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div class="bg-gray-900 p-6 rounded-lg max-w-4xl w-full relative">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-[400px]">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
        ></div>
      </div>

      <!-- Actor Content -->
      <template v-else-if="actor">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Left Column - Actor Info -->
          <div class="md:w-1/3">
            <img
              :src="
                actor.profile_path
                  ? `${API.IMAGE_BASE_URL}${actor.profile_path}`
                  : '/images/user-round.svg'
              "
              :alt="actor.name"
              class="w-full rounded-lg mb-4"
            />
            <h2 class="text-2xl font-bold mb-4 text-white">{{ actor.name }}</h2>
            <div class="space-y-2 text-gray-300">
              <p v-if="actor.birthday">
                <span class="font-semibold">Дата рождения:</span>
                {{ formatDate(actor.birthday) }}
              </p>
              <p v-if="actor.place_of_birth">
                <span class="font-semibold">Место рождения:</span>
                {{ actor.place_of_birth }}
              </p>
              <p v-if="actor.deathday">
                <span class="font-semibold">Дата смерти:</span>
                {{ formatDate(actor.deathday) }}
              </p>
              <p>
                <span class="font-semibold">Популярность:</span>
                {{ Math.round(actor.popularity) }}
              </p>
            </div>
          </div>

          <!-- Right Column -->
          <div class="md:w-2/3">
            <!-- Biography -->
            <div class="mb-6">
              <h3 class="text-2xl font-semibold mb-2 text-white">Биография</h3>
              <div class="max-h-[200px] overflow-y-auto pr-4 scrollbar-hide">
                <p class="text-gray-300 text-lg leading-relaxed">
                  {{ actor.biography || "Биография отсутствует" }}
                </p>
              </div>
            </div>

            <!-- Filmography -->
            <div v-if="movies.length">
              <h3 class="text-xl font-semibold mb-4 text-white">Известные фильмы</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div
                  v-for="movie in movies"
                  :key="movie.id"
                  class="cursor-pointer hover:scale-105 transition-transform duration-300"
                  @click="goToMovie(movie.id)"
                >
                  <img
                    :src="
                      movie.poster_path
                        ? `${API.IMAGE_BASE_URL}${movie.poster_path}`
                        : '/images/qwer.webp'
                    "
                    :alt="movie.title"
                    class="w-full h-[180px] object-cover rounded-lg mb-2"
                  />
                  <p class="font-semibold text-sm text-white truncate">
                    {{ movie.title }}
                  </p>
                  <p class="text-gray-400 text-xs">
                    {{ formatDate(movie.release_date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  actorId: {
    type: [Number, String],
    required: true,
  },
});

defineEmits(["close"]);

const router = useRouter();
const actor = ref(null);
const movies = ref([]);
const loading = ref(true);

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const formatDate = (dateString) => {
  if (!dateString) return "Неизвестно";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
};

const goToMovie = (movieId) => {
  window.location.href = `/movie/${movieId}`;
};

onMounted(async () => {
  try {
    const [detailsRes, creditsRes] = await Promise.all([
      fetch(`${API.BASE_URL}/person/${props.actorId}?api_key=${API.KEY}&language=ru-RU`),
      fetch(
        `${API.BASE_URL}/person/${props.actorId}/movie_credits?api_key=${API.KEY}&language=ru-RU`
      ),
    ]);

    const [details, credits] = await Promise.all([detailsRes.json(), creditsRes.json()]);

    actor.value = details;
    movies.value = credits.cast.sort((a, b) => b.popularity - a.popularity).slice(0, 12);
  } catch (error) {
    console.error("Ошибка при загрузке информации об актёре:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
