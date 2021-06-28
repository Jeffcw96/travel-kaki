<template>
    <div class="d-flex align-items-center">
        <component v-for="(item,fieldName) in nearbySchema"
        :key="item.refLabel"
        :is="item.component"
        v-bind="item"
        @update-value="handleInput($event,fieldName,item.type)" />
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
import {  INPUT, SLIDER } from '@/enum/common'
import nearby from '@/schema/nearby'

export default{
    name:"Nearby",
    computed:{
        nearbySchema(){
            return nearby
        }
    },
    methods:{
        ...mapMutations(["user/updatePosition",
                    "user/updateConfiguration",
                    "user/setCircleAreaRadius"]),
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

            if(type=== SLIDER){
                this["user/setCircleAreaRadius"](value)
            }

            this["user/updateConfiguration"]({
                    fieldName,
                    value
            });
        },

    },
    beforeDestroy(){
        console.log("before destroy hook")
    }


}

</script>