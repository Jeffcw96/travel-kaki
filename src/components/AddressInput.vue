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
import { mapMutations } from "vuex";
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
    return {
      addressLat: null,
      addressLng: null,
    };
  },
  methods: {
    ...mapMutations(["user/updatePosition"]),
    handleInput({ target }) {},
    handleAddressInput() {
      console.log("autocomplete", this.autocomplete.getPlace());
    },
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

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("place", place);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const placeId = place.place_id;
      this["user/updatePosition"]({
        refLabel: this.refLabel,
        lat,
        lng,
        placeId,
      });
    });
  },
};
</script>