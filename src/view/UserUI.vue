<template>
  <div class="user-ui-container">
    <div class="d-flex">
      <AddressInput
        :refLabel="'origin'"
        placeholderLabel="From"
        :cssClass="[
          'mx-10',
          'my-10',
          'px-10',
          'py-10',
          'w-250',
          'border-standard',
        ]"
      />
      <AddressInput
        :refLabel="'destination'"
        placeholderLabel="To"
        :cssClass="[
          'mx-10',
          'my-10',
          'px-10',
          'py-10',
          'w-250',
          'border-standard',
        ]"
      />
      <DistanceMatric />
    </div>
  </div>
</template>
<script>
import DistanceMatric from "@/components/DistanceMatric";
import AddressInput from "@/components/AddressInput";
export default {
  name: "UserUI",
  components: {
    AddressInput,
    DistanceMatric,
  },
};
</script>
<style>
.user-ui-container {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}
</style>