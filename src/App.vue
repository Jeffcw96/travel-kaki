<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: "App",
  methods:{
    ...mapActions(['auth/fireConnection'])
  },
  created(){
    this['auth/fireConnection']()
  }
};

</script>

<style>

</style>
