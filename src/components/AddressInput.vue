<template>
  <div>
    <input
      type="text"
      :placeholder="placeholderLabel"
      @input="handleInput"
      :ref="refLabel"
      :class="classes"
    />
  </div>
</template>
<script>
export default {
  name: "AddressInput",
  props: {
    placeholderLabel: {
      type: String,
      default: "",
    },
    cssClass: {
      type: Array,
      default: [],
    },
    refLabel: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    handleInput({ target }) {},
  },
  computed: {
    classes() {
      return this.cssClass.join(" ");
    },
  },
  mounted() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.$refs[this.refLabel],
      {
        bounds: new google.maps.LatLngBounds(new google.maps.LatLng()),
      }
    );
  },
};
</script>