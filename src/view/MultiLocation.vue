<template>
    <div class="container">
        <div class='d-flex'>
            <component v-for="(item,fieldName) in multiLocationSchema"
            :key="item.refLabel"
            :is="item.component"
            v-bind="item"
            @update-value="handleInput($event,fieldName,item.type)" />
        </div>
        <div>
            <div 
            @click="search"
            >Search</div>
        </div>
    </div>
</template>
<script>
import {  INPUT, DROPDOWN } from '@/enum/common'
import {mapMutations, mapActions} from 'vuex'
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