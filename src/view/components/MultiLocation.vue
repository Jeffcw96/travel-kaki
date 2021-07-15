<template>
    <div class="d-flex  mobile-display-block">
        <component v-for="(item,fieldName) in multiLocationSchema"
        :key="item.refLabel"
        :is="item.component"
        v-bind="item"
        @update-value="handleInput($event,fieldName,item.type)"
        @update-validation="updateValidation($event,fieldName)" />
    </div>
</template>
<script>
import {mapMutations,mapActions} from 'vuex'
import {  INPUT, DROPDOWN } from '@/enum/common'
import multiLocation from '@/schema/multiLocation'
export default {
    name:"MultiLocation",
    computed:{
        multiLocationSchema(){
            return multiLocation
        }
    },
    methods:{
        ...mapMutations(["user/updatePosition",
                    "user/updateConfiguration"]),
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

            this["user/updateConfiguration"]({
                    fieldName,
                    value
            });
        },
        updateValidation(value,fieldName){
            this["validation/updateValidation"]({key:fieldName,value})
        }
    }


}

</script>