<template>
    <div class="modal">
        <div class="input-container">
            <input type="email" v-model="email" placeholder="Email" autocomplete="off"/>
        </div>
        <div  class="input-container"> 
            <input :type="inputType" 
            v-model="password" 
            placeholder="Password" 
            autocomplete="off" 
            @focus="changeInputType"/>
        </div>
        <div class="flex">
            <div @click="cancel">Cancel</div>
            <div @click="login">Login</div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
    name:"Login",
    data(){
        return{
            email:"",
            password:"",
            inputType:"text"
        }
    },
    methods:{
        ...mapActions(['auth/login']),
        login(){
            if(!this.isValidInput()) return
            let params = {}
            params.email = this.email
            params.password = this.password
            this['auth/login'](params)
            this.email = ""
            this.password = ""
            this.cancel()
        },
        isValidInput(){
            if(this.email.trim().length === 0 || this.password.trim().length === 0){
                return false
            }
            return true
        },
        cancel(){
            this.$emit("close")
        },
        changeInputType({target}){
            if(target){
                if(target.type === "text"){
                    this.inputType = "password"
                }
            }
        }
    }
}
</script>
<style>
.modal{
    position: absolute;
    right: 10px;
    top: 50px;
    background: white;
    padding: 10px;
}

.flex{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flex div{
    width: 30%;
    padding: 5px 10px;
    font-size: 0.8rem;
    cursor: pointer;
}

.input-container{
    margin: 5px 0;
}

</style>