<template>
  <div :class="parentClasses" class="position-relative">
    <label>{{label}} ({{formattedRadius}} km)</label>
    <input type="range" 
    :class="classes"
    :min="minVal" 
    :max="maxVal" 
    v-model="inputVal" 
    @input="handleInput">
    <small class="position-absolute min">
        {{min}}
    </small>
    <small class="position-absolute max">
        {{max}}
    </small>
  </div>
</template>
<script>
import { Kilometer } from '@/enum/common'
export default {
  name: "Slider",
  data(){
      return{
          inputVal:this.defaultValue
      }
  },
  props: {
    placeholderLabel: {
      type: String,
      default: "",
    },
    cssClass: {
      type: Array,
      default: () => []
    },
    parentClass: {
      type: Array,
      default: () => []
    },
    refLabel: {
      type: String,
      default: "",
    },
    label:{
      type:String,
      default: "",
    },
    unit:{
        type:String,
        default:Kilometer
    },
    min:{
        type:Number,
        default:0
    },
    max:{
        type:Number,
        default:5
    },
    defaultValue:{
        type:Number,
        default:0
    },
  },
  methods: {    
    handleInput() {
      this.$emit("update-value",this.inputVal)
    },

  },
  computed: {
    classes() {
      return this.cssClass.join(" ");
    },
    parentClasses(){
      return this.parentClass.join(" ");
    },
    minVal(){
        if(this.unit === Kilometer){
            return this.min * 1000
        }
        return this.min
    },
    maxVal(){
        if(this.unit === Kilometer){
            return this.max * 1000
        }
        return this.max
    },
    formattedRadius(){
        return (this.inputVal/1000).toFixed(1) 
    }

  },
};
</script>
<style scoped>
input[type=range]{
    cursor: grab;
}

.min, 
.max{
    bottom: 0;
}

.max{
    right: 0;
}
</style>