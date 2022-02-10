<template>
  <header
    class="u-border-b u-border-gray u-flex u-m-md u-mr-xl u-pb-md u-px-md"
  >
    <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
      {{ localize("A5E.TabNotes") }}
    </h3>
  </header>

  <section class="u-h-full u-overflow-y-auto">
    <div
      v-if="sheetIsLocked"
      v-html="data.data.details.notes || `<p>Nothing to display.</p>`"
      class="u-flex-grow u-p-lg u-pt-xs"
    ></div>

    <editor
      v-else
      :init="{
        content_style: '.mce-content-body { font-size:0.833rem; }',
        toolbar:
          'styleselect | alignleft aligncenter alignright alignjustify | bullist numlist | image table hr link removeformat code',
        menubar: false,
      }"
      :initial-value="data.data.details.notes"
      plugins="code hr image link lists table"
      v-model="notes"
    />
  </section>
</template>

<script>
import { inject, ref, watch } from "vue";

import Editor from "@tinymce/tinymce-vue";

export default {
  components: { Editor },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheetIsLocked = inject("sheetIsLocked");

    const notes = ref(data.value.data.details.notes);

    watch(
      () => notes.value,
      async (curr) => {
        await actor.update({ "data.details.notes": curr });
      }
    );

    return {
      data,
      notes,
      localize: (key) => game.i18n.localize(key),
      sheetIsLocked,
    };
  },
};
</script>
