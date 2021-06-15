<template>
      <div class="user-ui-container" :class="{active:!menuIsActive}">
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
          <AddressInput
            :refLabel="'origin'"
            placeholderLabel="From"
            :cssClass="[
              'mx-10',
              'my-10',
              'px-10',
              'py-10',
              'w-250',
              'border-standard',
            ]"
          />
          <AddressInput
            :refLabel="'destination'"
            placeholderLabel="To"
            :cssClass="[
              'mx-10',
              'my-10',
              'px-10',
              'py-10',
              'w-250',
              'border-standard',
            ]"
          />
          <DistanceMatric />
        </div>
      <PlacesDetail/>
    </div>
</template>
<script>
import DistanceMatric from "@/components/DistanceMatric";
import PlacesDetail from "@/components/PlacesDetail"
import AddressInput from "@/components/AddressInput";
export default {
  name: "UserUI",
  components: {
    AddressInput,
    DistanceMatric,
    PlacesDetail
  },
  data(){
    return{
      menuIsActive:false
    }
  },
  methods:{
    toggleMenu(){
      this.menuIsActive = !this.menuIsActive
    }
  }
};
</script>
<style>
.user-ui-container {
  position: absolute;
  z-index: 999;
  top: 50px;
  left: 0;
  background: rgb(255, 71, 71);
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
    background: rgb(255, 71, 71);
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