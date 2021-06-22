<template>
  <div :class="parentClasses">
    <label>{{label}}</label>
    <input
      :type="inputType"
      :placeholder="placeholderLabel"
      @input="handleInput"
      :ref="refLabel"
      :class="classes"
      :blur="runValidation"
      v-model="inputVal"
    />
  </div>
</template>
<script>
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
    }
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

      console.log("this.inputVal", typeof(this.inputVal))
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
    runValidation(){
        this.validations.forEach(validation =>{
            const error = validation(this.inputLabel,this.inputVal)
            console.log(error)
            this.errors.push(error)
        })

        console.log("this.errors",this.errors)
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