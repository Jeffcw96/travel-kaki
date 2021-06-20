<template>
  <div>
    <UserUI />
    <!-- <GoogleMap /> -->
    <MultiLocation />
  </div>
</template>
<script>
import MultiLocation from "@/view/UserUI"
import GoogleMap from "@/components/GoogleMap";
import UserUI from "@/view/UserUI";
export default {
  name: "Home",
  components: {
    UserUI,
    GoogleMap,
    MultiLocation
  },
};
</script>