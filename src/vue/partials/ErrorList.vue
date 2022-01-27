<template>
  <ul
    class="
      u-flex u-flex-col u-gap-md u-list-style-none u-p-0 u-text-light u-text-sm
    "
  >
    <li
      class="u-align-center u-bg-red u-flex u-px-lg u-py-md u-rounded"
      v-for="error in errors"
      :key="error"
    >
      <i class="u-mr-md fas fa-exclamation-circle"></i>
      {{ error }}
    </li>
  </ul>
</template>

<script>
export default {
  props: { errors: Array },
};
</script>
