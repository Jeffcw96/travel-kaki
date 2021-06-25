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
                :ref="`marker-${place.place_id}`"
                @click="showInfoWindow(place.place_id)"
                :class="{ active: place.place_id === activeIndex }"
                style="cursor: pointer; padding:10px"
            >
                <div class="content">
                    <div class="header">{{ place.name }}</div>
                    <div class="meta">{{ place.vicinity }}</div>
                </div>
            </div>
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
            markers:this.placeMarkers,
            markersLength: this.getMarkerLength
        }
    },
    watch:{
        "$store.state.user.places": {
            deep: true,
            handler(val) {
                this.places = this.getQueryPlaces;
                this.markersLength =  this.getMarkerLength
            },
        },
        "$store.state.user.activeMarkerIndex": {
        deep: true,
            handler(activeMarkerIndex) {      
                console.log("active marker in side nav",activeMarkerIndex)         
                this.activeIndex = activeMarkerIndex
                const el = this.$refs[`marker-${activeMarkerIndex}`]               
                if (el) {
                     console.log("el",el)
                    el[0].scrollIntoView({behavior: 'smooth'});
                }
            },
        },
    },
    methods:{
        ...mapMutations(['user/activeMarker']),
        showInfoWindow(place_id) {
            this.activeIndex = place_id;
            this['user/activeMarker'](place_id)
        },
    },
    computed:{
        ...mapGetters(['user/getMarkers',
                       'user/getPlaces']),
        getQueryPlaces(){
            return this['user/getPlaces']
        },
        getMarkerLength(){
            return this['user/getMarkers'].length
        }
        
    }

}
</script>
<style>
.active{
    background-color:rgb(235, 22, 22);
}

.item{
    transition: all .3s;
    border-bottom: 1px solid rgb(73, 73, 73);;
}

.item:hover{
    background-color:rgb(255, 71, 71);
}

.item:hover .header, .item.active .header{
    font-weight: bold;
}

.item:hover .meta, .item.active .meta{
    color: white;
}

.item:last-child{
    border:none
}

.meta{
    font-size: 0.8rem;
    margin-top: 5px;
    color: rgb(112, 112, 112);
}

.places-detail-container{
    max-height: 450px;
    overflow-y: scroll;
    background: #f6f6f6
}

</style>