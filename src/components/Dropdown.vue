<template>
    <div style='position:relative'>        
        <div :class="parentClass">
            <label>{{label}}</label>
            <input type="text" 
            v-model="search" 
            @keyup="filterSearch" 
            @click="showSelection"
            @blur="hideSelection"
            :class="cssClass"/>
        </div>
        <div v-show="show" class="suggestion-container">
            <ul>
                <li v-for="(item,ind) of dropDownSuggestions"
                :key="ind"
                class="suggestion"
                @mousedown="selectDropDown(item.label,item.value)"
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
        selectDropDown(label,value){
            this.search = label
            this.$emit('update-value',value)
            this.hideSelection()
        },
        showSelection(){
            this.show = true
        },
        hideSelection(){
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
    padding: 10px;
    list-style: none;
    cursor: pointer;
}

.suggestion:nth-child(even){
    background: #fff8fa;
}

.suggestion:hover{
    background: #fcbdce;
}
 
.suggestion-container{
    position: absolute;
    background: white;
    z-index: 1;
    width:100%;
}

ul{
    margin: 0;
    padding: 0;
    max-height: 300px;
    overflow-y: scroll;
    border: 1px solid gray;
}


::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(243, 241, 241, 0.623);
	background-color: #F5F5F5;
}

::-webkit-scrollbar
{
	width: 6px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
	background-color: #df5454;
}


</style>