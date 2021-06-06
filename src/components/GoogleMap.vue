<template>
  <div ref="map" id="map"></div>
</template>
<script>
export default {
  name: "GoogleMap",
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
  async mounted() {
    const { latitude, longitude } = await this.currentLatAndLong();
    const map = new google.maps.Map(this.$refs["map"], {
      zoom: 15,
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
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