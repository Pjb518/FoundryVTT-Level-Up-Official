<template>
  <section class="u-flex u-flex-col u-p-lg u-h-full u-overflow-y-auto">
    <section class="u-h-full u-overflow-y-auto">
      <ul
        class="
          u-flex-shrink-0 u-gap-xs u-grid u-grid-3 u-list-style-none u-m-0 u-p-0
        "
      >
        <skill
          v-for="[label, skill] in Object.entries(data.data.skills)"
          :key="label"
          :label="label"
          :skill="skill"
        />
      </ul>
    </section>
  </section>
</template>

<script>
import { inject, onMounted } from "vue";

import Skill from "./partials/Skill.vue";

export default {
  components: { Skill },
  setup() {
    const data = inject("data");
    const sheet = inject("sheet");

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    return {
      data,
    };
  },
};
</script>
