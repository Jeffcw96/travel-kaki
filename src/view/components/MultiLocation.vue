<template>
    <div class="d-flex align-items-center">
        <component v-for="(item,fieldName) in multiLocationSchema"
        :key="item.refLabel"
        :is="item.component"
        v-bind="item"
        @update-value="handleInput($event,fieldName,item.type)" />
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
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

    }


}

</script>