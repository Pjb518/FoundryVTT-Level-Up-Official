<template>
  <section class="u-flex u-flex-col u-flex-grow u-p-lg">
    <editor v-model="description" />
  </section>
</template>

<script>
import { inject, ref, watch } from "vue";

import Editor from "../../forms/Editor.vue";

export default {
  components: { Editor },
  setup() {
    const data = inject("data");
    const item = inject("item");

    const description = ref(data.value.data.description);

    watch(
      () => description.value,
      async (curr) => {
        await item.update({ "data.description": curr });
      }
    );

    return { data, description };
  },
};
</script>
