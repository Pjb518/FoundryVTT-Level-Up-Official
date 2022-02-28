<template>
  <header
    class="u-border-b u-border-gray u-flex u-m-md u-mr-xl u-pb-md u-px-md"
  >
    <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
      {{ localize("A5E.TabNotes") }}
    </h3>
  </header>

  <section class="a5e-editor u-flex u-flex-col u-flex-grow u-overflow-y-auto">
    <div
      v-if="sheetIsLocked"
      v-html="
        TextEditor.enrichHTML(data.data.details.notes) ||
        `<p>Nothing to display.</p>`
      "
      class="u-flex-grow u-p-lg u-pt-xs"
    ></div>

    <div class="u-flex u-flex-col u-flex-grow u-p-lg u-pt-xs" v-else>
      <editor v-model="notes" />
    </div>
  </section>
</template>

<script>
import { inject, ref, watch } from "vue";

import Editor from "../../forms/Editor.vue";

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
      TextEditor,
    };
  },
};
</script>
