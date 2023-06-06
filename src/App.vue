<template>
  <div id="app">
    <block />
    <router-view />
  </div>
</template>

<script>
import Block from "./components/Block";

export default {
  components: { Block }
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "@/styles/bootstrap.scss";
@import "@/styles/app.scss";
</style>
