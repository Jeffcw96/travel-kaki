<template>
    <div class='container d-flex'>
        <component v-for="(item,fieldName) in multiLocationSchema"
        :key="item.refLabel"
        :is="item.component"
        v-bind="item"
        @update-value="handleInput($event,item.refLabel,fieldName)" />
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
import multiLocation from '@/schema/multiLocation'
export default {
    name:"MultiLocation",
    computed:{
        multiLocationSchema(){
            return multiLocation
        }
    },
    methods:{
        ...mapMutations(["user/updatePosition"]),
        handleInput(value,refLabel){
            this["user/updatePosition"]({
                refLabel,
                lat:value.lat,
                lng:value.lng,
                placeId:value.placeId,
            });
        }
    }
}
</script>
<style scoped>
    .container{
        background: rgb(247, 98, 98);
        padding: 10px;
    }
</style>