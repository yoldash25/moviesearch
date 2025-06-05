<template>
  <div
    class="flex"
    :style="{
      backgroundImage: `url(${backdropUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="w-[100%] bg-gradient-to-r from-black to-transparent">
      <div class="w-[50%] h-screen p-10">
        <div>
          <h2 class="text-7xl font-bold mb-10">{{ movie.title }}</h2>
          <p><strong>ID: </strong>{{ movie.id }}</p>

          <div class="flex gap-4 items-center">
            <div
              class="inline-block px-3 py-1 rounded font-semibold text-lg"
              :class="ratingClass"
            >
              {{ Math.round(movie.vote_average * 10) / 10 }}
            </div>

            <div class="font-semibold text-lg">
              {{ formatDate(movie.release_date) }}
            </div>

            <div class="font-semibold flex items-center gap-2 text-lg">
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div class="w-24">{{ formatRuntime(movie.runtime) }}</div>
            </div>

            <div>
              <span
                v-for="genre in movie.genres"
                :key="genre.id"
                class="font-semibold rounded-full bg-gray-800 px-4 py-2 mr-1 text-lg cursor-pointer hover:bg-gray-700 transition-colors duration-300"
                @click="handleGenreClick(genre.id)"
              >
                {{ genre.name }}
              </span>
            </div>
          </div>

          <div class="flex items-center mt-4 gap-6">
            <button
              class="mt-6 flex items-center justify-center w-16 h-16 rounded-full hover:bg-gray-500/50 transition-colors duration-300 relative"
              @click="$emit('toggle-favorite')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="isFavorite ? 'text-blue-500' : 'text-gray-400'"
              >
                <path d="M7 10v12" />
                <path
                  d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
                />
              </svg>
            </button>

            <div v-if="movie.tagline" class="mt-2">
              <p class="text-xl font-semibold">Слоган:</p>
              <p class="text-2xl italic">{{ movie.tagline }}</p>
            </div>

            <div
              v-if="movie.status"
              class="ml-10 font-semibold flex items-center gap-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-sans text-white mt-4"
            >
              Статус: {{ movie.status }}
              <div v-if="movie.status === 'Released'" class="text-green-500">
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
                  <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="overflow-y-auto max-h-[300px] pr-4 scrollbar-hide">
              <p class="text-3xl font-sans text-white leading-relaxed">
                {{ movie.overview }}
              </p>
            </div>
          </div>

          <div class="mt-10">
            <p
              v-if="movie.budget"
              class="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-sans text-white mt-4"
            >
              Бюджет: {{ formatCurrency(movie.budget) }}
            </p>
            <p
              v-if="movie.revenue"
              class="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-sans text-white mt-4"
            >
              Сборы: {{ formatCurrency(movie.revenue) }}
            </p>
          </div>

          <div v-if="movie.spoken_languages?.length" class="flex gap-2">
            <p
              class="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-sans text-white mt-4"
            >
              Языки:
            </p>
            <ul
              class="list-none flex flex-wrap gap-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-sans text-white mt-4"
            >
              <li v-for="language in movie.spoken_languages" :key="language.iso_639_1">
                {{ language.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const handleGenreClick = (genreId) => {
  router.push({
    path: `/genres/${genreId}`,
  });
};

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  imageBaseUrl: {
    type: String,
    required: true,
  },
});

defineEmits(["toggle-favorite"]);

const backdropUrl = computed(() =>
  props.movie?.backdrop_path
    ? `${props.imageBaseUrl}${props.movie.backdrop_path}`
    : "/images/qwer.webp"
);

const ratingClass = computed(() => {
  const rating = props.movie?.vote_average || 0;
  if (rating >= 7) return "bg-green-500 text-white";
  if (rating >= 5) return "bg-yellow-500 text-black";
  return "bg-red-500 text-white";
});

function formatDate(dateString) {
  if (!dateString) return "Неизвестно";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
  }).format(new Date(dateString));
}

function formatRuntime(minutes) {
  if (!minutes) return "Неизвестно";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} мин`;
  if (m === 0) return `${h} час`;
  return `${h} ч ${m} мин`;
}

function formatCurrency(value) {
  return value ? `$${value.toLocaleString()}` : "Неизвестно";
}
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
