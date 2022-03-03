<template>
  <button class="u-align-center u-flex u-px-lg u-pointer u-w-fit">
    <i class="u-m-0" :class="icon"></i>
  </button>
</template>

<script>
export default {
  emits: ["onEditorButtonClick"],
  props: { icon: String },
};
</script>
