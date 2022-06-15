<template>
  <header
    class="u-border-b u-border-gray u-flex u-m-md u-mr-xl u-pb-md u-px-md"
  >
    <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
      {{ localize("A5E.TabSettings") }}
    </h3>
  </header>

  <section
    class="u-flex-grow u-grid u-grid-2 u-overflow-y-auto u-gap-md u-px-md"
    style="grid-auto-rows: min-content"
  >
    <div class="u-flex u-flex-col u-gap-md">
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
    </div>

    <div class="u-flex u-flex-col u-gap-md">
      <form-section>
        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="flags.a5e.IncludeAbilityModifiersForSkills"
            :id="`${data._id}-include-ability-mods-for-skills`"
            :checked="data.flags.a5e?.IncludeAbilityModifiersForSkills ?? false"
          />

          <label class="u-pointer" :for="`${appId}-show-spell-slots`">
            {{ localize("A5E.IncludeAbilityModifiersForSkills") }}
          </label>
        </div>
      </form-section>
    </div>
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
