<template>
  <div>
      <div ref="map" id="map"></div>
      <Login v-show="show"
      @close="show=false"/>
      <div class="login-icon" @click="show = true">
        <img :src="userIcon"/>
      </div>
  </div>
</template>
<script>
import userIcon from '@/assets/user.png'
import { mapGetters } from "vuex";
import {Tabs} from "@/enum/common"
import Login from "@/view/components/Login"
export default {
  name: "GoogleMap",
  components:{
    Login
  },
  data(){
    return{
      circle:null,
      strokeOpacity: 0,
      fillOpacity: 0,
      userIcon:userIcon,
      show:false
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
        this.circle.setRadius(val)
      },
      deep:true
    },
    activeTab:{
      handler(val){            
        if(this.circle){
          console.log("val",val)
          if(val === Tabs.multilocation){
              console.log("tab is multilocation")
              this.circle.setOptions({fillOpacity:0, strokeOpacity:0});
            return
          }
          this.circle.setOptions({fillOpacity:0.35, strokeOpacity:0.8});
        }
      },
      immediate:true
    },
  },
  computed: {
    ...mapGetters(["user/getAddresses",
                  "user/getCircleAreaRadius",
                  "tab/getActiveTab"]),
                
    activeTab(){
        return this["tab/getActiveTab"]
    },
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
      strokeOpacity: 0,
      strokeWeight: 2,
      fillColor: "#5fe3ff",
      fillOpacity: 0,
      map,
      center: new google.maps.LatLng(latitude, longitude),
      radius: this.getCircleAreaRadius,
    });
    this.circle = cityCircle   
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

.login-icon{
  position: absolute;
  right: 12px;
  top: 10px;
  max-width: 30px;
  max-height: 30px;
  background: white;
  padding:5px;
  cursor: pointer;
  z-index: 999;
}

.login-icon img{
  width: 100%;
  height:100%
}
</style>