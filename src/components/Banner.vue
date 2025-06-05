<template>
  <!-- navbar -->
  <div class="relative z-50 text-white">
    <nav class="flex items-center justify-between bg-[#040714] pt-2 w-full px-10">
      <div class="flex items-center">
        <img src="../../public/logogo65.png" alt="" class="w-28 h-28"/>
        <router-link
          to="/"
          class="px-4 py-2 mx-1 text-2xl relative group hover:text-blue-600"
          >Главная</router-link
        >
        <router-link
          to="/genres"
          class="px-4 py-2 mx-1 text-2xl relative group hover:text-blue-600"
          >Каталог</router-link
        >
      </div>
      <div class="flex items-center gap-10">
        <router-link to="/favourites">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            name="favourite"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="glow"
          >
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            />
          </svg>
        </router-link>
        <router-link to="/search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            name="search"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="gloq"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup></script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.menu-item {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: white;
  font-weight: 500;
}
.menu-item:hover {
  background-color: #f3f4f6;
  color: #000;
}

@keyframes glow {
  0% {
    filter: drop-shadow(0 0 5px #ff0000) drop-shadow(0 0 15px #ff0000);
  }
  50% {
    filter: drop-shadow(0 0 20px #ff6b6b) drop-shadow(0 0 30px #ff6b6b);
  }
  100% {
    filter: drop-shadow(0 0 5px #ff0000) drop-shadow(0 0 15px #ff0000);
  }
}

.glow {
  animation: glow 2s infinite ease-in-out;
}

@keyframes glov {
  0% {
    filter: drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 15px #ffffff);
  }
  50% {
    filter: drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 30px #ffffff);
  }
  100% {
    filter: drop-shadow(0 0 5px #ffffff) drop-shadow(0 0 15px #ffffff);
  }
}

.glov {
  animation: glov 2.5s infinite ease-in-out;
}

@keyframes gloq {
  0% {
    filter: drop-shadow(0 0 5px #0044ff) drop-shadow(0 0 15px #12ffdf);
  }
  50% {
    filter: drop-shadow(0 0 20px #0044ff) drop-shadow(0 0 30px #12ffdf);
  }
  100% {
    filter: drop-shadow(0 0 5px #0044ff) drop-shadow(0 0 15px #12ffdf);
  }
}

.gloq {
  animation: gloq 3s infinite ease-in-out;
}
</style>
