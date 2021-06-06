<template>
  <div>
    <AddressInput
      :refLabel="'originAddress'"
      placeholderLabel="From"
      :cssClass="['mx-10', 'h-100']"
    />
  </div>
</template>
<script>
import AddressInput from "@/components/AddressInput";
export default {
  name: "Home",
  components: {
    AddressInput,
  },
};
</script>