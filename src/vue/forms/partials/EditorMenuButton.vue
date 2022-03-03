<template>
  <button class="u-align-center u-flex u-px-lg u-pointer u-w-fit">
    <i class="u-m-0" :class="icon"></i>
  </button>
</template>

<script setup>
const emits = defineEmits(["onEditorButtonClick"]);
const props = defineProps({ icon: String });
</script>
