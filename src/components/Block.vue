<template>
  <BlockUI v-show="show" :message="message">
    <font-awesome-icon icon="cog" class="fa-spin fa-3x fa-fw" />
  </BlockUI>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import BlockUI from "vue-blockui";

Vue.use(BlockUI);

export default {
  computed: {
    ...mapGetters("block", ["message"]),
    show() {
      return this.message != false;
    }
  }
};
</script>
