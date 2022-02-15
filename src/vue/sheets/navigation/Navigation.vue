<template>
  <nav class="u-flex" data-group="main">
    <a
      v-for="tab in tabs"
      class="a5e-tab"
      :class="{ 'a5e-tab--active': activeTab.name === tab.name }"
      :key="tab.name"
      @click="$emit('update-active-tab', tab)"
    >
      {{ localize(tab.label) }}
    </a>

    <div class="u-border-b u-border-gray u-w-full"></div>
  </nav>
</template>

<script>
export default {
  emits: ["update-active-tab"],
  props: { activeTab: Object, tabs: Array },
  setup() {
    return {
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
