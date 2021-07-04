<template>
  <div class="button-container">
    <button
      class="button"
      @click.prevent="Search"
      :style="
        !gotOrigin && !gotDestination ? 'cursor:not-allowed' : 'cursor:pointer'
      "
    >
      Search
    </button>
  </div>
</template>
<script>
import { APIKey, RouteRadiusThreshold, MarkUpRouteDistance } from "@/enum/common";
import placeHTML from '@/enum/content'
import { mapGetters, mapActions, mapMutations } from "vuex";
import {Tabs} from "@/enum/common"
export default {
  name: "DistanceMatric",
  data() {
    return {
      map:null,
      gotOrigin: false,
      gotDestination: false,
      markers:{},
      markerIndex:0,
      shopIndex:0,
      allProcessedShops:[],
      tabActive:null
    };
  },
  watch: {
    activeTab:{
      handler(val){
          this.tabActive = val
      },
      immediate:true
    },
    "$store.state.user.original_location": {
      deep: true,
      handler() {
        this.gotOrigin = true;
      },
    },
    "$store.state.user.destination_location": {
      deep: true,
      handler() {
        this.gotDestination = true;
      },
    },
    "$store.state.user.activeMarkerIndex": {
      deep: true,
      handler(activeMarkerIndex) {
        console.log('all markers',this.markers)
         new google.maps.event.trigger(this.markers[activeMarkerIndex], "click");

      },
    },
               
  },
  methods: {
    ...mapMutations(['user/activeMarker',
                    'user/setAdvanceGeometry']),
    ...mapActions(['user/listMarkers',
                   'user/listPlaces',
                   "user/findDistance",
                   "user/resetLocation",
                   "user/nearby",
                   "user/placeDetails",
                   'user/getPlaceImage',
                   "user/placesNearMe"]),
    resetPlacesMarkers(){
        this.markers = []
    },  
    async Search(){
      this["user/resetLocation"]()
      this.resetPlacesMarkers()
      if(this.tabActive === Tabs.multilocation){
        this.calculateDistanceMatric()
      }else if(this.tabActive === Tabs.nearby){
        this.nearByMeSearch()
      }
    },
    async nearByMeSearch(){
      const result = await this["user/placesNearMe"]()
      const {lat,lng} = this.$store.state.user.original_location
      const map = this.getGoogleMap(lat,lng)
      const cityCircle = new google.maps.Circle({
        strokeColor: "#5fe3ff",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#5fe3ff",
        fillOpacity: 0.35,
        map,
        center: new google.maps.LatLng(lat, lng),
        radius: parseFloat(this.currentRadius)
      });
      this.labelMarker(result,map)
    },
    async calculateDistanceMatric() {
      if (!this.inputIsValid) return;
      const {latitude,longitude} = await this.currentLatAndLong()
      const map = this.getGoogleMap(latitude,longitude)

      const response = await this["user/findDistance"]();
      const result = response.data.result
      const originAddress = result.origin_addresses[0];
      const destinationAddress = result.destination_addresses[0];

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
          this['user/setAdvanceGeometry']({locationsGeometry:routesPathLocation, radius:radius*1000})
          continue
        }

        accumulatorDistance += distance;
        
        if (accumulatorDistance >= RouteRadiusThreshold || i === allRoutes.length - 1){
            const startLat = allRoutes[i].start_location.lat();
            const startLng = allRoutes[i].start_location.lng();
            const location = {lat:startLat, lng:startLng, radius:1000}
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
      for (let i = 0; i<shopsArr.length; i++) {
        const shop = shopsArr[i]
        const placeId = shop.place_id;
        const { lat, lng } = shop.geometry.location;
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
        });

        this.markers.push(marker)
        google.maps.event.addListener(marker, "click", async () => {
          this['user/activeMarker'](i)
          map.setZoom(15);
          console.log(marker.getPosition())
          map.setCenter(marker.getPosition());            
          const response = await this["user/placeDetails"]({placeId})
          
          const placeDetails = response.data.result;
          let imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${APIKey}`;;                  

          const formattedRating = this.roundDownNearest(placeDetails.rating,0.5)
          const base64ImageUrl = await this['user/getPlaceImage'](imageUrl)            

          let output = placeHTML.replace(/{%placeName%}/g,placeDetails.name)          
          output = output.replace(`{%${formattedRating}%}`,'checked')
          output = output.replace(/{%placeRouting%}/g,placeDetails.url)
          output = output.replace(/{%placeImage%}/g, base64ImageUrl.data.url)
          infoWindow.setContent(output);
          infoWindow.open(map, marker);
        });


      }
      console.log(this.markers)
      console.log(this.allProcessedShops)
      this['user/listMarkers'](this.markers)
      this['user/listPlaces'](shopsArr)
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
      if(rating - floor < interval){
        return floor
      }
      return floor+interval
    }
  },
  computed:{
    ...mapGetters(['user/getRating',
                   'user/getType',
                   'user/getCircleAreaRadius',
                   'tab/getActiveTab']),
    inputIsValid(){
      return  this.gotOrigin && this.gotDestination
    },
    rating(){
      return this['user/getRating']
    },
    placeType(){
      return this['user/getType']
    },
    activeTab(){
      return this["tab/getActiveTab"]
    },
    currentRadius(){
      return this["user/getCircleAreaRadius"]
    }
  },
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

.button-container{
  text-align: right;
  padding: 10px ;
}

.button{
  padding: 5px 15px;
  border: 1px solid #58d696;
  border-radius: 20px;
  color: white;
  background: #58d696;
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 2px;
  font-family: 'Roboto', sans-serif
}

.advance-search{
  margin:0 15px;
  text-decoration:none; 
  color:white;
  cursor: pointer;
}

</style>