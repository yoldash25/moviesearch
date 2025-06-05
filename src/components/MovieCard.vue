<template>
  <div
    class="group text-white shadow cursor-pointer duration-300 ease-in-out hover:scale-125 hover:shadow-lg rounded-3xl overflow-hidden w-[370px] h-[220px]"
  >
    <div></div>
    <div class="">
      <div class="">
        <img
          :src="backdropUrl"
          alt="Постер фильма"
          loading="lazy"
          class="w-full h-[180px] object-cover rounded-t-3xl duration-300 ease-in-out group-hover:scale-150 hover:shadow-lg rounded-3xl overflow-hidden"
          @click="goToMovie"
        />
        <div
          class="flex mt-1 justify-between items-center rounded-b-3xl "
        >
          <h2
            class="group-hover:opacity-100 opacity-0  bottom-2 left-2 z-20 p-2 rounded-full bg-black/10 hover:bg-black/70 transition-colors duration-300"
            @click="goToMovie"
          >
            {{ movie.title }}
          </h2>
          <p
            class="absolute top-2 left-2 z-20 p-2 rounded-full bg-black/10 hover:bg-black/70 transition-colors duration-300"
            @click="goToMovie"
          >
            {{ movie.release_date?.slice(0, 4) || "Неизвестно" }}
          </p>
          <button
            class="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/10 hover:bg-black/70 transition-colors duration-300"
            @click="toggleFavorite"
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
              class="lucide lucide-thumbs-up-icon lucide-thumbs-up"
              :class="props.movie.isFavorite ? 'text-blue-500' : 'text-gray-400'"
            >
              <path d="M7 10v12" />
              <path
                d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, onMounted } from "vue";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const API = {
  KEY: import.meta.env.VITE_API_KEY,
  TOKEN: import.meta.env.VITE_ACCESS_TOKEN,
  ACCOUNT_ID: import.meta.env.VITE_ACCOUNT_ID,
  BASE_URL: import.meta.env.VITE_BASE_URL,
  IMAGE_BASE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
};

const query = computed(() => route.query.q || "");
const currentPage = computed(() => parseInt(route.query.page) || 1);

const goToMovie = () => {
  router.push({
    path: route.path,
    query: {
      q: query.value.trim(),
      page: currentPage.value,
      id: props.movie.id,
    },
    name: "MovieModal",
    params: { id: props.movie.id },
  });
};
const size = "original";
const backdropUrl = computed(() =>
  props.movie?.backdrop_path
    ? `${API.IMAGE_BASE_URL}${props.movie.backdrop_path}`
    : "/inyan.png"
);

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
      // Check if we have more pages
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
    const url = `${API.BASE_URL}/account/${API.ACCOUNT_ID}}/favorite`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${API.TOKEN}`,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: props.movie.id,
        favorite: !props.movie.isFavorite,
      }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to update favorite status");
    }

    // Обновляем локальное состояние
    props.movie.isFavorite = !props.movie.isFavorite;

    const allFavorites = await fetchAllFavoritePages();
    props.movie.isFavorite = allFavorites.some((m) => m.id === props.movie.id);
  } catch (error) {
    console.error("Error updating favorite:", error);
  }
};
onMounted(async () => {
  try {
    const allFavorites = await fetchAllFavoritePages();
    // Update movie's favorite status
    props.movie.isFavorite = allFavorites.some((m) => m.id === props.movie.id);
  } catch (error) {
    console.error("Error checking favorite status:", error);
  }
});
</script>
