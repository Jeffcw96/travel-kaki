<template>
  <div>
    <UserUI />
    <GoogleMap />
  </div>
</template>
<script>
import GoogleMap from "@/components/GoogleMap";
import UserUI from "@/view/UserUI";
export default {
  name: "Home",
  components: {
    UserUI,
    GoogleMap,
  },
};
</script>