<template>
  <ul class="a5e-error-list">
    <li class="a5e-error" v-for="error in errors" :key="error">
      <i class="a5e-error__icon fas fa-exclamation-circle"></i>
      {{ error }}
    </li>
  </ul>
</template>

<script>
export default {
  props: { errors: Array },
};
</script>
