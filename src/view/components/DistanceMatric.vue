<template>
  <div class="button-container">
    <button
      class="button"
      :class="{'spinner-container' : isLoading }"
      @click.prevent="Search"
      :style="
        (!gotOrigin && !gotDestination) || !validationIsValid ? 'cursor:not-allowed' : 'cursor:pointer'
      "
    >
       <span class="material spinner" v-show="isLoading"></span>
      <div v-show="!isLoading">
        Search
      </div>      
    </button>
  </div>
</template>
<script>
import carIcon from '@/assets/car.png'
import utils from "@/utils/common"
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
      tabActive:null,
      circle:null,
      isLoading:false
    };
  },
  watch: {
    activeTab:{
      handler(val){
          this.tabActive = val
          if(this.circle){
            if(val === Tabs.nearby){
              this.circle.setOptions({fillOpacity:0.35, strokeOpacity:0.8});
            }else{
              this.circle.setOptions({fillOpacity:0, strokeOpacity:0});
            }
          }
      },
      immediate:true
    },
    "$store.state.user.original_location": {
      deep: true,
      handler(location) {            
        this.gotOrigin = true;
        if(this.tabActive === Tabs.nearby){
          const map = this.getGoogleMap(location.lat, location.lng)
          this.circle.setOptions({fillOpacity:0.35, strokeOpacity:0.8});
          map.setCenter({lat:location.lat,lng:location.lng})
        }
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
         new google.maps.event.trigger(this.markers[activeMarkerIndex], "click");

      },
    },
    getCircleAreaRadius:{
      handler(val){
        if(this.circle){
          this.circle.setRadius(val)
        }

      },
      deep:true
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
      if(!this['validation/isValid']) return
      this["user/resetLocation"]()
      this.resetPlacesMarkers()
      this.isLoading = true
      if(this.tabActive === Tabs.multilocation){
        this.calculateDistanceMatric()
      }else if(this.tabActive === Tabs.nearby){
        this.nearByMeSearch()
      }
    },
    async nearByMeSearch(){
      if(!this.gotOrigin) return
      const result = await this["user/placesNearMe"]()
      const {lat,lng} = this.$store.state.user.original_location
      const map = this.getGoogleMap(lat,lng)
      this.circle.setOptions({fillOpacity:0.35, strokeOpacity:0.8});
      this.labelMarker(result,map)
    },
    async calculateDistanceMatric() {
      if (!this.inputIsValid) return;
      const {latitude,longitude} = await utils.currentLatAndLong()
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
          map.setCenter(marker.getPosition());            
          const response = await this["user/placeDetails"]({placeId})
          
          const placeDetails = response.data.result;
          let imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placeDetails.photos[0].photo_reference}&key=${APIKey}`;;                  

          const formattedRating = utils.roundDownNearest(placeDetails.rating,0.5)
          const base64ImageUrl = await this['user/getPlaceImage'](imageUrl)            

          let output = placeHTML.replace(/{%placeName%}/g,placeDetails.name)        
          output = output.replace(`{%${formattedRating}%}`,'checked')
          output = output.replace(/{%carIcon%}/, carIcon)  
          output = output.replace(/{%placeRouting%}/g,placeDetails.url)
          output = output.replace(/{%placeImage%}/g, base64ImageUrl.data.url)
          infoWindow.setContent(output);
          infoWindow.open(map, marker);
        });
      }

      this['user/listMarkers'](this.markers)
      this['user/listPlaces'](shopsArr)
      this.isLoading = false
    },
    getGoogleMap(latitude,longitude){
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      const cityCircle = new google.maps.Circle({
        strokeColor: "#5fe3ff",
        strokeOpacity: 0,
        strokeWeight: 2,
        fillColor: "#5fe3ff",
        fillOpacity: 0,
        map,
        center: new google.maps.LatLng(latitude, longitude),
        radius: this.getCircleAreaRadius
      });
      this.circle = cityCircle
      return map
    },
  },
  computed:{
    ...mapGetters(['user/getRating',
                   'user/getType',
                   'user/getCircleAreaRadius',
                   'tab/getActiveTab',
                   'validation/isValid']),
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
    validationIsValid(){
      return this['validation/isValid']
    },
    getCircleAreaRadius(){
      if(this["user/getCircleAreaRadius"]){
        return parseInt(this["user/getCircleAreaRadius"])
      }
      return 0
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
  font-family: 'Roboto', sans-serif;
  min-width: 90px;
  min-height: 30px;
}

.advance-search{
  margin:0 15px;
  text-decoration:none; 
  color:white;
  cursor: pointer;
}

.spinner-container {
  position: relative;
  letter-spacing: 0.5px;
}

.spinner::after {
  content: '';
  box-sizing: border-box;
  width: 25px;
  height: 25px;
  position: absolute;
  top: calc(50% - 13px);
  left: calc(50% - 10px);
  border-radius: 50%;
} 

.spinner.material::after {
  border-top: 4px solid rgba(255, 255, 255, 1.0);
  border-left: 4px solid rgba(255, 255, 255, 1.0);
  border-bottom: 4px solid rgba(255, 255, 255, 1.0);
  border-right: 4px solid rgba(255, 255, 255, 0.0);
  animation: spinner .6s linear infinite;
}

@keyframes spinner {
  to {transform: rotate(360deg);}
}
</style>