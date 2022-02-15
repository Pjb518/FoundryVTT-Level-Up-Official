<template>
  <section class="u-h-full u-pt-lg">
    <editor
      :init="{
        content_style: '.mce-content-body { font-size:0.833rem; }',
        toolbar:
          'styleselect | alignleft aligncenter alignright alignjustify | bullist numlist | image table hr link removeformat code',
        menubar: false,
      }"
      :initial-value="data.data.description"
      plugins="code hr image link lists table"
      v-model="description"
    />
  </section>
</template>

<script>
import { inject, ref, watch } from "vue";

import Editor from "@tinymce/tinymce-vue";

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
