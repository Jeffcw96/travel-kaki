<template>
  <div>
    <UserUI />
    <GoogleMap />
  </div>
</template>
<script>
import {mapActions} from 'vuex'
import MultiLocation from "@/view/UserUI"
import GoogleMap from "@/view/components/GoogleMap";
import UserUI from "@/view/UserUI";
export default {
  name: "Home",
  components: {
    UserUI,
    GoogleMap,
    MultiLocation
  },
  methods:{
    ...mapActions(['auth/verifyUser'])
  },
  created(){
    this['auth/verifyUser']()
  }
};
</script>