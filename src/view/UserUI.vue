<template>
      <div class="user-ui-container" 
      :class="{active:!menuIsActive}" 
      :style="'background-image:url('+backgroundImg+')'">>
        <div class="arrow-container" @click="toggleMenu" v-show="!menuIsActive">
          <span class="arrow-right">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M312,256l-199-199a15,15 0 01 0-19l29-29a15,15 0 01 19,0l236,235a16,16 0 01 0,24l-236,235a15,15 0 01-19,0l-29-29a15,15 0 01 0-19z" />
            </svg>
          </span>
        </div>
        <div class="arrow-container" @click="toggleMenu" v-show="menuIsActive">
          <span class="arrow-left">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M351,9a15,15 0 01 19,0l29,29a15,15 0 01 0,19l-199,199l199,199a15,15 0 01 0,19l-29,29a15,15 0 01-19,0l-236-235a16,16 0 01 0-24z" />
            </svg>
          </span>
        </div>
        <div class="d-flex align-items-center">
            <component v-for="(item,fieldName) in multiLocationSchema"
            :key="item.refLabel"
            :is="item.component"
            v-bind="item"
            @update-value="handleInput($event,fieldName,item.type)" />
        </div>
        <DistanceMatric />
      <PlacesDetail/>
    </div>
</template>
<script>
import backgroundImg from '@/assets/mountain.jpg'
import DistanceMatric from "@/components/DistanceMatric";
import PlacesDetail from "@/components/PlacesDetail"
import AddressInput from "@/components/AddressInput";
import {  INPUT, DROPDOWN } from '@/enum/common'
import {mapMutations, mapActions} from 'vuex'
import multiLocation from '@/schema/multiLocation'
export default {
  name: "UserUI",
  components: {
    AddressInput,
    DistanceMatric,
    PlacesDetail
  },
  data(){
    return{
      menuIsActive:true,
      backgroundImg:backgroundImg
    }
  },
  computed:{
    multiLocationSchema(){
        return multiLocation
    }
  },

  methods:{
    ...mapMutations(["user/updatePosition",
                    "user/updateConfiguration"]),
    ...mapActions(['user/findDistance']),
    handleInput(value,fieldName,type){
      if(type=== INPUT){
          this["user/updatePosition"]({
              fieldName,
              lat:value.lat,
              lng:value.lng,
              placeId:value.placeId,
          });
          return
      }

      this["user/updateConfiguration"]({
            fieldName,
            value
      });
    },
    async search(){
        await this['user/findDistance']
    },
    toggleMenu(){
      this.menuIsActive = !this.menuIsActive
    }
  }
};
</script>
<style>

.container{
    /* background: rgb(247, 98, 98); */
    padding: 10px;
}

.user-ui-container {
  position: absolute;
  z-index: 999;
  top: 50px;
  left: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding-right: 20px;
  padding-bottom: 10px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  transition: all .2s;

}

.user-ui-container.active{
  transform: translateX(-100%);
}

.arrow-container{
    background-image: linear-gradient(270deg, #000000 0%, #2c3e50 74%);
    padding: 5px;
    position: absolute;
    right: -35px;
    max-width: 50px;
    top: 10px;
    cursor:pointer
}

.arrow-right, .arrow-left {
  flex: 0 0 auto;
  padding: 5px;
  display: block;
  fill: rgb(255, 255, 255);
  stroke: black
}

.arrow-right svg, .arrow-left svg{ 
  --size: 1rem;
  fill: inherit;
  min-height: var(--size);
  min-width:  var(--size);
}

</style>