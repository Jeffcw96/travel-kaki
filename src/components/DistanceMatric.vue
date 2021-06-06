<template>
  <div>
    <button
      @click="calculateDistanceMatric"
      :style="
        !gotOrigin && !gotDestination ? 'cursor:not-allowed' : 'cursor:pointer'
      "
    >
      Search
    </button>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "DistanceMatric",
  data() {
    return {
      gotOrigin: false,
      gotDestination: false,
    };
  },
  watch: {
    "$store.state.user.origin": {
      deep: true,
      handler() {
        this.gotOrigin = true;
      },
    },
    "$store.state.user.destination": {
      deep: true,
      handler() {
        this.gotDestination = true;
      },
    },
  },
  methods: {
    calculateDistanceMatric() {},
  },
};
</script>