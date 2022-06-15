<template>
  <header
    class="u-border-b u-border-gray u-flex u-m-md u-mr-xl u-pb-md u-px-md"
  >
    <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
      {{ localize("A5E.TabSettings") }}
    </h3>
  </header>

  <section
    class="u-flex-grow u-grid u-grid-2 u-overflow-y-auto u-gap-lg u-px-md"
    style="grid-auto-rows: min-content"
  >
    <form-section
      heading="A5E.CarryCapacityMultiplier"
      hint="Do not increase this number to account for your size category."
    >
      <div class="u-w-full">
        <div class="u-w-20">
          <input
            class="a5e-input"
            type="number"
            data-dtype="Number"
            min="1"
            name="flags.a5e.carryCapacityMultiplier"
            :value="data.flags.a5e?.carryCapacityMultiplier || 1"
          />
        </div>
      </div>
    </form-section>
  </section>
</template>

<script>
import { inject } from "vue";

import FormSection from "../../forms/FormSection.vue";

export default {
  components: { FormSection },
  setup() {
    const actor = inject("actor");
    const data = inject("data");

    return {
      data,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
