<template>
  <div :class="parentClasses" >
    <label>{{label}}</label>
    <input
      type="text"
      :placeholder="placeholderLabel"
      :ref="refLabel"
      :class="classes"
      :value="currentAddress"
    />
    <div v-if="allowNearBy" 
    class="position-absolute nearby-icon"
    @click="searchMyLocation">
      <img :src="locationImg" alt="location" />
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import locationImg from '@/assets/location.png'
export default {
  name: "AddressInput",
  data() {
    return {
      addressLat: null,
      addressLng: null,
      locationImg:locationImg,
      currentAddress:""
    };
  },
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
    },
    allowNearBy:{
      type:Boolean,
      default:false
    }
  },
  methods: {   
    ...mapActions(['user/getAddressByGeometry',
                  "user/updatePosition",
                  "user/getCurrentLocation"]),
    async searchMyLocation(){
     const { formatted_address, place_id, geometry }= await this['user/getCurrentLocation']()
      this.currentAddress = formatted_address
      const {lat,lng} = geometry.location
      this.$emit('update-value',{lat,lng,placeId:place_id})
    }
  },
  computed: {
    classes() {
      return this.cssClass.join(" ");
    },
    parentClasses(){
      return this.parentClass.join(" ");
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

.nearby-icon{
  max-width: 30px;
  top: 22px;
  right: 5px;
  cursor:pointer;
}

.nearby-icon img{
  width:100%
}
</style>