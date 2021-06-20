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
    <small class="advance-search">Advanced Search</small>
  </div>
</template>
<script>
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
      markerIndex:0,
      shopIndex:0,
      allProcessedShops:[]
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
    "$store.state.user.activeMarkerIndex": {
      deep: true,
      handler(activeMarkerIndex) {
         new google.maps.event.trigger(this.markers[activeMarkerIndex], "click");

      },
    },
               
  },
  methods: {
    ...mapMutations(['user/setMarkers',
                    'user/setPlaces',
                    'user/activeMarker']),
    ...mapActions(["user/findDistance",
                   "user/nearby",
                   "user/placeDetails",
                   'user/getPlaceImage']),
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
            this.nearBySearch(response.routes[0].legs[0].steps,map)
          }
        }
      );
    },
    async nearBySearch(allRoutes,map){
      let locationsGeometry = [];
      let accumulatorDistance = 0;
      for (let i = 0; i < allRoutes.length; i++) {
        const distance = allRoutes[i].distance.value;
        if(distance >= MarkUpRouteDistance){
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
    },
    labelMarker(result,map){
      const shopsArr = result.data.shops
      const infoWindow = new google.maps.InfoWindow();
      for (let shops of shopsArr) {        
        const processedShops = shops.filter((shop) => {
          return (shop.rating && shop.rating >= 3.0) && (shop.photos !== undefined);
        });
        this.allProcessedShops = [...this.allProcessedShops,...processedShops]
      }
      for (let shop of this.allProcessedShops) {
        const currentMarkerIndex = this.markerIndex
        const placeId = shop.place_id;
        const { lat, lng } = shop.geometry.location;
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
        });

        google.maps.event.addListener(marker, "click", async () => {
          console.log("marker button clicked",marker, shop,currentMarkerIndex)
          this['user/activeMarker'](currentMarkerIndex)
          map.setZoom(15);
          map.setCenter(marker.getPosition());            
          const response = await this["user/placeDetails"]({placeId})
          
          const placeDetails = response.data.result;
          let imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${APIKey}`;;                  
          console.log("placeDetails", response);

          const formattedRating = this.roundDownNearest(placeDetails.rating,0.5)
          console.log("formattedRating",typeof(placeDetails.rating), formattedRating)
          const base64ImageUrl = await this['user/getPlaceImage'](imageUrl)            

          let output = placeHTML.replace(/{%placeName%}/g,placeDetails.name)          
          output = output.replace(`{%${formattedRating}%}`,'checked')
          output = output.replace(/{%placeRouting%}/g,placeDetails.url)
          output = output.replace(/{%placeImage%}/g, base64ImageUrl.data.url)
          infoWindow.setContent(output);
          infoWindow.open(map, marker);


        });
        this.markerIndex++
        this.markers.push(marker)
      }
      this['user/setMarkers'](this.markers)
      this['user/setPlaces'](this.allProcessedShops)
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
    },
    roundDownNearest(rating,interval){
      const floor = parseFloat(Math.floor(rating))
      console.log("floor",floor,rating)
      if(rating - floor < interval){
        return floor
      }
      return floor+interval
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
@import url(//netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css);
/* Ratings widget */
.rate {
    display: inline-block;
    border: 0;
}
/* Hide radio */
.rate > input {
    display: none;
}
/* Order correctly by floating highest to the right */
.rate > label {
    float: right;
}
/* The star of the show */
.rate > label:before {
    display: inline-block;
    font-size: 2rem;
    padding: .3rem .2rem;
    margin: 0;
    cursor: pointer;
    font-family: FontAwesome;
    content: "\f005 "; /* full star */
}

/* Half star trick */
.rate .half:before {
    content: "\f089 "; /* half star no outline */
    position: absolute;
    padding-right: 0;
}
/* Click + hover color */
input:checked ~ label { color: #eaf903;  } /* color previous stars on hover */

/* Hover highlights */
input:checked , 
input:checked ~ label
{ color: #eaf903;  } 



.button{
  padding: 5px 15px;
  border: 1px solid gray;
  border-radius: 5px;
}

.advance-search{
  margin:0 15px;
  text-decoration:none; 
  color:white;
  cursor: pointer;
}

</style>