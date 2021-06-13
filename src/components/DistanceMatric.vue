<template>
  <div>
    <button
      class="button"
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
import { APIKey, RouteRadiusThreshold, MarkUpRouteDistance } from "@/enum/common";
import placeHTML from '@/enum/content'
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "DistanceMatric",
  data() {
    return {
      gotOrigin: false,
      gotDestination: false,
      markers:[],
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
    "$store.state.user.activeMarker": {
      deep: true,
      handler(activeMarker) {
         new google.maps.event.trigger(this.markers[activeMarker], "click");
      },
    },
               
  },
  methods: {
    ...mapMutations(['user/setMarkers',
                    'user/setPlaces']),
    ...mapActions(["user/findDistance",
                   "user/nearby",
                   "user/placeDetails"]),
    async calculateDistanceMatric() {
      if (!this.inputIsValid) return;
      const response = await this["user/findDistance"]();
      const result = response.data.result
      const originAddress = result.origin_addresses[0];
      const destinationAddress = result.destination_addresses[0];

      const { latitude, longitude } = await this.currentLatAndLong();

      const map = this.getGoogleMap(latitude,longitude)
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

            let locationsGeometry = [];
            let accumulatorDistance = 0;
            for (let i = 0; i < allRoutes.length; i++) {
              const distance = allRoutes[i].distance.value;
              if(distance >= MarkUpRouteDistance){
                console.log(distance, allRoutes[i].path.length)
                const radius = allRoutes[i].path.length.toString()[0]
                const pathDivider = Math.floor(distance / allRoutes[i].path.length)
                const routesPathLocation = allRoutes[i].path.reduce((acc,cur,ind) =>{
                  if(ind % pathDivider === 0){
                    return [...acc, {lat:cur.lat(), lng: cur.lng()}]
                  }
                  return acc                                   
                },[])
                const result = await this["user/nearby"]({locationsGeometry:routesPathLocation, radius:radius*1000})
                this.labelMarker(result,map)
                continue
              }

              accumulatorDistance += distance;
             
              if (accumulatorDistance >= RouteRadiusThreshold || i === allRoutes.length - 1){
                  const startLat = allRoutes[i].start_location.lat();
                  const startLng = allRoutes[i].start_location.lng();
                  const location = {lat:startLat, lng:startLng}
                  locationsGeometry.push(location)                                               
                  accumulatorDistance = 0;
                }
              }
              const result = await this["user/nearby"]({locationsGeometry})
              this.labelMarker(result,map)
          }
        }
      );
    },
    labelMarker(result,map){
      this['user/setPlaces'](result.data.shops)
      const shopsArr = result.data.shops
      const infoWindow = new google.maps.InfoWindow();
      this.markers = [];
      for (let shops of shopsArr) {
        const processedShops = shops.filter((shop) => {
          return (shop.rating && shop.rating >= 4.0) && (shop.photos !== undefined);
        });

        for (let shop of processedShops) {
          const placeId = shop.place_id;
          const { lat, lng } = shop.geometry.location;
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
          });

          this.markers.push(marker)

          google.maps.event.addListener(marker, "click", async () => {
            //place detail api
            let imageUrl = "";                  
            const response = await this["user/placeDetails"]({placeId})
            
            const placeDetails = response.data.result;
            console.log("placeDetails", response);
            if (placeDetails.photos) {
              imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${placeDetails.photos[0].photo_reference}&key=${APIKey}`;
            }
            let output = placeHTML.replace(/{%placeName%}/g,placeDetails.name)
            output = output.replace(/{%placeRating%}/g,placeDetails.rating)
            output = output.replace(/{%placeRouting%}/g,placeDetails.url)
            output = output.replace(/{%placeImage%}/g,imageUrl)


            infoWindow.setContent(output);
            infoWindow.open(map, marker);
          });
        }
      }
      this['user/setMarkers'](this.markers)
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
    getGoogleMap(latitude,longitude){
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });

      return map
    }
  },
  computed:{
    inputIsValid(){
      return  this.gotOrigin && this.gotDestination
    }
  }
};
</script>
<style>
.button{
    padding: 5px 15px;
    border: 1px solid gray;
    border-radius: 5px;
}


</style>