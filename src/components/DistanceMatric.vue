<template>
  <div>
    <button
      @click.prevent="calculateDistanceMatric"
      :style="
        !gotOrigin && !gotDestination ? 'cursor:not-allowed' : 'cursor:pointer'
      "
    >
      Search
    </button>
  </div>
</template>
<script>
import axios from "axios";
import { APIKey } from "@/enum/common";
import { mapGetters, mapActions } from "vuex";
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
    ...mapActions(["user/findDistance"]),
    async calculateDistanceMatric() {
      if (!this.gotOrigin && this.gotDestination) return;
      const result = await this["user/findDistance"]();
      console.log(result);
      const originAddress = result.data.origin_addresses[0];
      const destinationAddress = result.data.destination_addresses[0];

      console.log(originAddress, destinationAddress);
      console.log(document.getElementById("map"));

      const { latitude, longitude } = await this.currentLatAndLong();
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsService.route(
        {
          origin: originAddress,
          destination: destinationAddress,
          travelMode: "DRIVING",
        },
        async (response, status) => {
          if (status === "OK") {
            console.log(response);
            directionsRenderer.setDirections(response);
            directionsRenderer.setMap(map);

            const allRoutes = response.routes[0].legs[0].steps;
            let promises = [];
            for (let route of allRoutes) {
              const startLat = route.start_location.lat();
              const startLng = route.start_location.lng();

              const marker = new google.maps.Marker({
                position: new google.maps.LatLng(startLat, startLng),
                map: map,
              });

              const URL = `http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${startLat},${startLng}&type=restaurant&radius=1000&key=${APIKey}`;
              promises.push(axios.get(URL));
            }

            const result = await Promise.all(promises);
            console.log("result", result);
          }
        }
      );
    },
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
};
</script>