<template>
  <div class="bg-[#040714] text-white">
    <div class="w-[100%] h-[20vh] flex flex-col justify-center items-center">
      <span class="text-5xl mb-7">Смотрите так, как вам хочется</span>
      <span>Наслаждайтесь величайшими историями мира — в любое время и в любом месте.</span>
    </div>
    <div
      style="
        background-image: url('../../public/images/compose.webp');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        height: 500px;
        width: 100%;
      "
    ></div>
    <div class="mx-auto mt-16 flex gap-10 justify-center items-center">
      <div v-for="(dum, index) in dums" :key="index" class="mb-10 items-center">
        <div class="flex flex-col justify-between items-center w-[500px]">
          <img
            :src="dum.logo"
            alt="Logo"
            class="w-[80px] h-[80px] object-cover rounded-lg shadow-lg mx-auto"
          />
          <span class="my-10 text-3xl text-center">{{ dum.title }}</span>
          <span class="text-lg mx-5 text-center">{{ dum.subtitle }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const dums = [
  {
    title: "Бесконечные развлечения, на любой вкус",
    subtitle: "Откройте для себя тысячи часов сериалов, фильмов и оригинальных произведений.",
    logo: "../../public/images/div11.webp",
  },
  {
    title: "Доступно на ваших любимых устройствах",
    subtitle: "Транслируйте контент на четырех экранах одновременно на совместимых устройствах.",
    logo: "../../public/images/div22.webp",
  },
  {
    title: "Простой в использовании родительский контроль",
    subtitle: "Обеспечьте безопасность своей семьи с помощью нашего интуитивно понятного родительского контроля.",
    logo: "../../public/images/div33.webp",
  },
];
</script>
