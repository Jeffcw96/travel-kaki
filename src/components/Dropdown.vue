<template>
    <div style='position:relative'>        
        <div :class="parentClass">
            <label>{{label}}</label>
            <div style='position:relative'>
                <input type="text" 
                v-model="search" 
                @keyup="filterSearch" 
                @click="showSelection"
                @blur="hideSelection"
                :class="cssClass"/>
                <div class="icons">
                    <span class="icon" v-show="!show">
                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M455,113a15,15 0 01 19,0l29,29a15,15 0 01 0,19l-235,236a16,16 0 01-24,0l-235-236a15,15 0 01 0-19l29-29a15,15 0 01 19,0l199,199z" />
                        </svg>
                    </span>
                    <span class="icon" v-show="show">
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M256,200l-199,199a15,15 0 01-19,0l-29-29a15,15 0 01 0-19l235-236a16,16 0 01 24,0l235,236a15,15 0 01 0,19l-29,29a15,15 0 01-19,0z" />
                            </svg>
                    </span>
                </div>
            </div>
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

.icons{
    position: absolute;
    right: 0;
    top:50%;
    transform: translateY(-50%);
}

.icon {
  flex: 0 0 auto;
  padding: 5px;
  display: block;
  fill: #000;
  stroke: #000;
}

.icon svg { 
  --size: 0.8em;

  fill: inherit;
  min-height: var(--size);
  min-width:  var(--size);
}

</style>