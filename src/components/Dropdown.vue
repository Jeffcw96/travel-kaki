<template>
    <div style='position:relative'>
        <div>
            <pre>{{show}}</pre>
            <input type="text" 
            v-model="search" 
            @keyup="filterSearch" 
            @focus="showSelection"
            @blur="hideSelection"/>
        </div>
        <div v-show="show" class="suggestion-container">
            <ul>
                <li v-for="(item,ind) of dropDownSuggestions"
                :key="ind"
                class="suggestion"
                @click="selectDropDown(item.value)"
                >{{item.label}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            search:"",
            show:false,
            dropDownSuggestions:[],
            allSuggestions:[]
        }
    },
    props:{
        suggestions:{
            type:Function,
            default:()=>{},
        },
        cssClass: {
            type: Array,
            default: [],
        },
        parentClass: {
            type: Array,
            default: [],
        },
        refLabel: {
        type: String,
        default: "",
        },
        label:{
            type:String,
            default: "",
        }
    },
    methods:{
        selectDropDown(value){
            console.log("drop down val",value)
        },
        showSelection(){
            console.log("show")
            this.show = true
        },
        hideSelection(){
            console.log("hide")
            this.show = false
        },
        filterSearch(){
            this.dropDownSuggestions = this.allSuggestions.filter(suggestion =>{
                return suggestion.label.toUpperCase().includes(this.search.toUpperCase())
            })
        },
    },
    mounted(){
        this.dropDownSuggestions = this.suggestions()
        this.allSuggestions =  this.suggestions()
    }

}
</script>
<style >
.suggestion{
    padding:5px 10px;
    border: 1px solid black;
}
 
.suggestion-container{
    position: absolute;
    background: white;
}
</style>