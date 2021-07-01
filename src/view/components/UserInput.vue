<template>
    <div>
        <div class="d-flex label-container align-items-center"
        :style="'background-image:url('+backgroundImg+')'">
            <div>
                <label for="multilocation" 
                class="label"
                :class="{'nearby-tab-active':tabActive === nearby}"
                >
                    Search By Routes
                </label>
                <input type="radio" :value="multilocation" id="multilocation" v-model="tabActive" @input="swapTab"/>
            </div>
            <div>
                <label for="nearby"                 
                style="border-top-right-radius: 10px"
                class="label"
                :class="{'multilocation-tab-active':tabActive === multilocation}">
                    Nearby Me
                </label>
                <input type="radio" :value="nearby" id="nearby" v-model="tabActive" @input="swapTab"/>
            </div>
        </div>
        <div v-if="tabActive === 'multilocation'">
            <MultiLocationInput/>
        </div>
        <div v-else>
            <NearBy/>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import MultiLocationInput from "@/view/components/MultiLocation"
import NearBy from "@/view/components/NearBy"
import backgroundImg from '@/assets/mountain.jpg'
import {Tabs} from "@/enum/common"
export default {
    name:"UserInput",
    components:{
        MultiLocationInput,
        NearBy
    },
    data(){
        return{
            tabActive:null,
            backgroundImg:backgroundImg,
            multilocation:Tabs.multilocation,
            nearby:Tabs.nearby
        }
    },
    methods:{
        ...mapActions(['tab/setActive']),
        swapTab(e){
            this["tab/setActive"](e.target.value)
        }
    },
    computed:{
        ...mapGetters(["tab/getActiveTab"]),
        activeTab(){
            return this["tab/getActiveTab"]
        }
    },
    watch:{
        activeTab:{
            handler(val){
                console.log('val',val)
                this.tabActive = val
            },
            immediate:true
        }
    }
}
</script>
<style>
input[type=radio]{
    display: none;
}

.label-container{
    position: absolute;
    top:-38px;
    left:0;
    color:white;
    background-position: left;
    border-top-right-radius: 10px;
}

.label{
    display: block;
    padding: 10px 25px;
    cursor:pointer;
    transition:all .5s
}

.nearby-tab-active{
    border: 1px solid gray;
    border-left: none;
}

.multilocation-tab-active{
    border: 1px solid gray;
    border-right: none;
}
</style>