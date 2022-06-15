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
            :checked="
              data.flags.a5e?.IncludeAbilityModifiersForSkills ??
              data.type === 'npc'
            "
          />

          <label
            class="u-pointer"
            :for="`${data._id}-include-ability-mods-for-skills`"
          >
            {{ localize("A5E.SettingsIncludeAbilityModifiersForSkills") }}
          </label>
        </div>
      </form-section>

      <form-section v-if="data.type === 'character'">
        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="flags.a5e.showManeuverTab"
            :id="`${data._id}-show-maneuver-tab`"
            :checked="data.flags.a5e?.showManeuverTab ?? true"
          />

          <label class="u-pointer" :for="`${data._id}-show-maneuver-tab`">
            {{ localize("A5E.SettingsShowManeuverTab") }}
          </label>
        </div>
      </form-section>

      <form-section>
        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="flags.a5e.showSpellTab"
            :id="`${data._id}-show-spell-tab`"
            :checked="data.flags.a5e?.showSpellTab ?? true"
          />

          <label class="u-pointer" :for="`${data._id}-show-spell-tab`">
            {{ localize("A5E.SettingsShowSpellTab") }}
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
    const data = inject("data");

    return {
      data,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
