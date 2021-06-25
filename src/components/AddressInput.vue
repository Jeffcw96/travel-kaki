<template>
  <div :class="parentClasses">
    <label>{{label}}</label>
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
    parentClass: {
      type: Array,
      default: [],
    },
    refLabel: {
      type: String,
      default: "",
    },
    label:{
      type:String,
      default: "",
    }
  },
  data() {
    return {
      addressLat: null,
      addressLng: null,
    };
  },
  methods: {    
    handleInput({ target }) {},
    handleAddressInput() {
     
    },
  },
  computed: {
    classes() {
      return this.cssClass.join(" ");
    },
    parentClasses(){
      return this.parentClass.join(" ");
    }
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
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const placeId = place.place_id;
      this.$emit('update-value',{lat,lng,placeId})
    });
  },
};
</script>
<style scoped>
::placeholder {
  font-style:italic;
}
</style>