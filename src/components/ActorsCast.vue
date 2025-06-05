<template>
  <div v-if="cast" class="mt-10">
    <p class="font-semibold mb-4 text-xl ml-10">Участники фильма</p>
    <Swiper
      :slides-per-view="5"
      :direction="'horizontal'"
      :navigation="true"
      :space-between="30"
      class="w-[850px] h-[350px]"
      :modules="[Navigation]"
    >
      <!-- Director Slide -->
      <SwiperSlide v-if="director?.name" class="cursor-pointer" @click="$emit('select-actor', director.id)">
        <div class="p-2 text-center w-[160px] h-[300px] hover:scale-105 transition-all duration-300">
          <img
            :src="director.profile_path ? `${imageBaseUrl}${director.profile_path}` : '/images/user-round.svg'"
            alt="Фото режиссёра"
            class="w-full h-[200px] rounded-lg object-cover"
          />
          <div class="mt-2 font-semibold truncate">{{ director.name }}</div>
          <div class="text-sm text-gray-300">Режиссёр</div>
        </div>
      </SwiperSlide>

      <!-- Cast Slides -->
      <SwiperSlide 
        v-for="actor in cast" 
        :key="actor.id" 
        class="cursor-pointer"
        @click="$emit('select-actor', actor.id)"
      >
        <div class="p-2 text-center w-[160px] h-[300px] hover:scale-105 transition-all duration-300">
          <img
            :src="actor.profile_path ? `${imageBaseUrl}${actor.profile_path}` : '/images/user-round.svg'"
            :alt="actor.name"
            class="w-full h-[200px] rounded-lg object-cover"
          />
          <div class="mt-2 font-semibold truncate">{{ actor.name }}</div>
          <div class="text-sm text-gray-300 truncate">
            {{ actor.character }}
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

defineProps({
  cast: {
    type: Array,
    required: true,
    default: () => []
  },
  director: {
    type: Object,
    default: null
  },
  imageBaseUrl: {
    type: String,
    required: true
  }
});

defineEmits(['select-actor']);
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