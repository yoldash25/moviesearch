<template>
  <div v-if="recommendations.length" class="mt-10 px-10 pb-10">
    <h3 class="text-2xl font-bold mb-6">Рекомендуемые фильмы</h3>
    <Swiper
      :slides-per-view="6"
      :space-between="30"
      :navigation="true"
      :modules="[Navigation, Mousewheel]"
      :mousewheel="{
          sensitivity: 1,
          forceToAxis: true,
          releaseOnEdges: true,
        }"
      class="recommendations-swiper"
    >
      <SwiperSlide
        v-for="movie in recommendations"
        :key="movie.id"
        class="cursor-pointer"
        @click="$emit('select-movie', movie.id)"
      >
        <div class="p-2 hover:scale-105 transition-transform duration-300">
          <img
            :src="
              movie.poster_path
                ? `${imageBaseUrl}${movie.poster_path}`
                : '/images/qwer.webp'
            "
            :alt="movie.title"
            class="w-full h-[300px] object-cover rounded-lg"
          />
          <div class="mt-2">
            <h4 class="font-semibold truncate">{{ movie.title }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-sm text-gray-400">
                {{ formatDate(movie.release_date) }}
              </span>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const props = defineProps({
  recommendations: {
    type: Array,
    required: true,
    default: () => [],
  },
  imageBaseUrl: {
    type: String,
    required: true,
  },
});

defineEmits(["select-movie"]);

function formatDate(dateString) {
  if (!dateString) return "Неизвестно";
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
  }).format(new Date(dateString));
}
</script>

<style scoped>
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: rgba(0, 0, 0, 0.8);
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 20px;
}

:deep(.swiper-button-disabled) {
  display: none;
}
</style>
