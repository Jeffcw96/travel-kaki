<template>
  <div :class="parentClasses">
    <label>{{label}}</label>
    <input
      :type="inputType"
      :placeholder="placeholderLabel"
      @input="handleInput"
      :ref="refLabel"
      :class="classes"
      v-model="inputVal"
    />
    <div class="error-message">
      {{errors[0]}}
    </div>
  </div>
</template>
<script>
import {removeValidation} from '@/validations/common'
export default {
  name: "TextBox",
  props: {
    placeholderLabel: {
      type: String,
      default: "",
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
    },
    onlyNumber:{
      type:Boolean,
      default:false
    },
    decimalPlaces:{
      type:Number,
      default:0
    },
    validations:{
        type:Array,
        default:[]
    },
    min:{
      type:Number,
      default:1
    },
    max:{
      type:Number,
      default:5
    },
  },
  data() {
    return {
        inputLabel:this.label,
        inputVal:"",
        errors:[]
    };
  },
  methods: {    
    handleInput() {
      if(this.onlyNumber){
        this.inputVal = parseFloat(this.inputVal)                
      }
      this.runValidation()
      this.$emit("update-value",this.inputVal)
    },
    runValidation(){
      this.validations.forEach(validation =>{
          const validationResult = validation(this.inputVal)
          if(validationResult === true){
            this.errors = []
          }else{
            this.errors.push(validationResult)
          }
          this.$emit('update-validation',this.errors)
      })
    },
  },
  computed: {
    classes() {
      return this.cssClass.join(" ");
    },
    parentClasses(){
      return this.parentClass.join(" ");
    },
    inputType(){
      if(this.onlyNumber){
        return "number"
      }
      return "text"
    },
  },
};
</script>
<style scoped>
::placeholder {
  font-style:italic;
}
</style>