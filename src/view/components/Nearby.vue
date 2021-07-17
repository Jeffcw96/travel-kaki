<template>
    <div class="d-flex  mobile-display-block">
        <component v-for="(item,fieldName) in nearbySchema"
        :key="item.refLabel"
        :is="item.component"
        :ref="item.refLabel"
        v-bind="item"
        @update-value="handleInput($event,fieldName,item.type)"
        @update-validation="updateValidation($event,fieldName)" />
    </div>
</template>

<script>
import {mapMutations,mapActions} from 'vuex'
import {  INPUT, SLIDER } from '@/enum/common'
import nearby from '@/schema/nearby'

export default {
    name:"nearby",
    computed:{
        nearbySchema(){
            return nearby
        }
    },
    methods:{
        ...mapMutations(["user/updatePosition",
                    "user/updateConfiguration",
                    "user/setCircleAreaRadius"]),
        ...mapActions(["validation/updateValidation"]),                    
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
        updateValidation(value,fieldName){
            this["validation/updateValidation"]({key:fieldName,value})
        }
    },
}

</script>