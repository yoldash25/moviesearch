<template>
  <div
    class="relative flex items-center top-3 mb-24"
  >
    <form
      @click="toggleSearch"
      @submit.prevent="submitSearch"
      class="absolute mt-10 w-full bg-white rounded-full shadow-lg p-2 pr-3 flex items-center border border-gray-200"
    >
      <input
        v-model="query"
        ref="inputEl"
        type="text"
        class="w-full bg-transparent outline-none px-2 py-2 text-sm text-gray-800"
        placeholder="Поиск фильма..."
      />

      <button
        v-if="query"
        type="button"
        @click="closeSearch"
        class="ml-2 text-gray-500 hover:text-red-500 text-xl leading-none"
      >
        &times;
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const query = ref("");
const showInput = ref(false);
const inputEl = ref(null);
const route = useRoute();
const router = useRouter();
const searchInput = ref(null);
const searchQuery = ref('');
const emit = defineEmits(['search']);

onMounted(() => {
  query.value = route.query.q || "";
});

watch(query, (newQuery) => {
  router.replace({
    path: route.path,
    query: { q: newQuery },
  });
});

const toggleSearch = () => {
  showInput.value = !showInput.value;
  if (showInput.value) {
    nextTick(() => inputEl.value?.focus());
  }
};

const closeSearch = () => {
  showInput.value = false;
  query.value = "";
};

const submitSearch = () => {
  if (query.value.trim()) {
    emit("search", query.value.trim());
    showInput.value = false;
  }
};

const handleInput = () => {
  emit('search', searchQuery.value);
};

onMounted(() => {
  searchInput.value?.focus();
});
</script>

<style scoped></style>
