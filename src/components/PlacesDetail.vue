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