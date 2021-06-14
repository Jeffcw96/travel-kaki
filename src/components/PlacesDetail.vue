<template>
    <div
        v-show="places.length !== 0"
        class="places-detail-container"
    >
        <div class="ui divided items">
        <div
            class="item"
            v-for="(place, ind) in places"
            :key="ind"
            @click="showInfoWindow(ind)"
            :class="{ active: ind === activeIndex }"
            style="cursor: pointer"
        >
            <div class="content">
            <div class="header">{{ place.name }}</div>
            <!-- <div class="meta">{{ place.vicinity }}</div> -->
            </div>
        </div>
                <pre>{{activeIndex}}</pre>
        </div>
    </div>
</template>
<script>
import {mapMutations, mapGetters} from 'vuex'
export default {
    data(){
        return{
            places :[],
            activeIndex:null,
            markers:this.placeMarkers
        }
    },
    watch:{
        "$store.state.user.places": {
            deep: true,
            handler(val) {
                console.log('this.getQueryPlaces',this.getQueryPlaces)
                this.places = this.getQueryPlaces;
            },
        },
        "$store.state.user.activeMarkerIndex": {
        deep: true,
            handler(activeMarkerIndex) {      
                console.log("active marker in side nav",activeMarkerIndex)         
                this.activeIndex = activeMarkerIndex
            },
        },
    },
    methods:{
        ...mapMutations(['user/activeMarker']),
        showInfoWindow(index) {
            this.activeIndex = index;
            this['user/activeMarker'](index)
        },
    },
    computed:{
        ...mapGetters([
                       'user/getPlaces']),
        // placeMarkers(){
        //     return this['user/markers']
        // },

        getQueryPlaces(){
            return this['user/getPlaces']
        }
    }

}
</script>
<style>
.active{
    background-color:red;
}

.places-detail-container{
    max-height: 450px;
    overflow-y: scroll;
    background: white;
    max-width: 300px;
}

</style>