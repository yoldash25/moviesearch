<template>
  <Banner />
  <router-view></router-view>
</template>

<script setup>
import Banner from "./components/Banner.vue";
</script>

<style>
body{
  background: linear-gradient(
    to bottom,
    #040714 0%,
    #0a1227 50%,
    #000 100%
  );
  min-height: 100vh;
  margin: 0;
  background-attachment: fixed;
}
</style>