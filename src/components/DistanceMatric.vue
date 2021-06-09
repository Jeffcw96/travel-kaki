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
import { APIKey, RouteRadiusThreshold } from "@/enum/common";
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
            console.log(`response.routes[0]`, response.routes[0]);
            let promises = [];
            let accumulatorDistance = 0;
            for (let route of allRoutes) {
              const distance = route.distance.value;
              accumulatorDistance += distance;
              if (accumulatorDistance >= RouteRadiusThreshold) {
                const startLat = route.start_location.lat();
                const startLng = route.start_location.lng();
                const URL = `http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${startLat},${startLng}&type=restaurant&radius=1000&key=${APIKey}`;
                promises.push(axios.get(URL));
                accumulatorDistance = 0;
              }
            }

            const results = await Promise.all(promises);
            const infoWindow = new google.maps.InfoWindow();
            console.log("result", results);
            for (let result of results) {
              const shops = result.data.results;
              const processedShops = shops.filter((shop) => {
                return shop.rating && shop.rating >= 4.0;
              });

              for (let shop of processedShops) {
                const placeId = shop.place_id;
                const { lat, lng } = shop.geometry.location;
                const marker = new google.maps.Marker({
                  position: new google.maps.LatLng(lat, lng),
                  map: map,
                });

                google.maps.event.addListener(marker, "click", async () => {
                  //place detail api
                  let imageUrl = "";
                  const URL = `http://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${APIKey}&place_id=${placeId}`;
                  const result = await axios.get(URL);
                  const placeDetails = result.data.result;
                  if (placeDetails.photos) {
                    imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${placeDetails.photos[0].photo_reference}&key=${APIKey}`;
                  }

                  console.log("placeDetails", placeDetails);
                  //info window allows to pop up a mini window when we click on the marker
                  //put your creative like review,rating, image HTML code here
                  infoWindow.setContent(
                    `<div class="ui header">${placeDetails.name}</div>
                    ${placeDetails.formatted_address}
                    ${placeDetails.formatted_phone_number}
                    ${placeDetails.rating}
                    <div style="max-width:400px"><img src="${imageUrl}" style="width:100%"/></div>`
                  );
                  infoWindow.open(map, marker);
                });
              }
            }
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