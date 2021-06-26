<template>
  <div ref="map" id="map"></div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "GoogleMap",
  data(){
    return{
      circle:null
    }
  },
  methods: {
    currentLatAndLong() {
      return new Promise((resolve, reject) => {
        //Prompt user permission for knowing location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position.coords.latitude && position.coords.longitude) {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            }
          },
          (error) => {
            reject(error.message);
          },
          { enableHighAccuracy: true }
        );
      });
    },
  },
  watch:{
    getCircleAreaRadius:{
      handler(val){
        console.log("radius val",val)
        this.circle.setRadius(val)
      }
    },
    deep:true
  },
  computed: {
    ...mapGetters(["user/getAddresses",
                  "user/getCircleAreaRadius"]),
    getAddresses() {
      return this["user/getAddresses"];
    },
    getCircleAreaRadius(){
      return parseInt(this["user/getCircleAreaRadius"])
    }
  },
  async mounted() {
    const { latitude, longitude } = await this.currentLatAndLong();
    const map = new google.maps.Map(this.$refs["map"], {
      zoom: 15,
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      
    });
    const cityCircle = new google.maps.Circle({
      strokeColor: "#5fe3ff",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#5fe3ff",
      fillOpacity: 0.35,
      map,
      center: new google.maps.LatLng(latitude, longitude),
      radius: this.getCircleAreaRadius,
    });
    this.circle = cityCircle
    const directionsService = new google.maps.DirectionsService();
  },
};
</script>
<style scoped>
#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>