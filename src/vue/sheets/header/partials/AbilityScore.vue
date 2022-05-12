<template>
  <li
    class="
      u-align-center
      u-bg-gray
      u-flex
      u-flex-col
      u-font-serif
      u-py-xs
      u-rounded
      u-w-full
    "
  >
    <h4 class="u-text-lg">{{ ability.label }}</h4>

    <div v-if="sheetIsLocked" class="a5e-ability-score__value">
      {{ ability.value }}
    </div>

    <input
      v-else
      class="a5e-ability-score__value"
      :name="`data.abilities.${label}.value`"
      type="number"
      :value="ability.value"
      placeholder="10"
    />

    <div
      class="a5e-ability-score__buttons"
      :class="{ 'u-justify-center u-gap-lg': sheetIsLocked }"
    >
      <div
        class="a5e-ability-score__roll-button"
        :title="localize('A5E.RollAbilityCheck')"
        @click.exact="onRollAbilityCheck(label)"
        @click.shift.exact="onRollAbilityCheck(label, 'advantage')"
        @click.ctrl.exact="onRollAbilityCheck(label, 'disadvantage')"
        @click.meta.exact="onRollAbilityCheck(label, 'disadvantage')"
      >
        {{ ability.check.deterministicBonus }}

        <div class="a5e-tooltip a5e-tooltip--ability-score">
          {{ localize("A5E.RollAbilityCheck") }}
        </div>
      </div>

      <i
        v-if="!sheetIsLocked"
        class="a5e-config-button fas fa-cog"
        :title="localize('A5E.ConfigureBonuses')"
        @click="onClickConfigButton(label)"
      ></i>

      <div
        class="a5e-ability-score__roll-button a5e-js-roll-saving-throw"
        :title="localize('A5E.RollSavingThrow')"
        @click.exact="onRollSavingThrow(label)"
        @click.shift.exact="onRollSavingThrow(label, 'advantage')"
        @click.ctrl.exact="onRollSavingThrow(label, 'disadvantage')"
        @click.meta.exact="onRollSavingThrow(label, 'disadvantage')"
      >
        {{ ability.save.deterministicBonus }}

        <div
          class="a5e-tooltip a5e-tooltip--ability-score"
          :class="{ 'a5e-tooltip--obstacle-right': label === 'cha' }"
        >
          {{ localize("A5E.RollSavingThrow") }}
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import { inject } from "vue";

export default {
  props: { ability: Object, label: String, sheetIsLocked: Boolean },
  setup() {
    const actor = inject("actor");

    function onClickConfigButton(ability) {
      actor.configureAbilityScore(ability);
    }

    function onRollAbilityCheck(ability, rollMode) {
      const options = {};

      if (rollMode) {
        options["rollMode"] = CONFIG.A5E.ROLL_MODE[rollMode.toUpperCase()];
      }

      actor.rollAbilityCheck(ability, options);
    }

    function onRollSavingThrow(ability, rollMode) {
      const options = {};

      if (rollMode) {
        options["rollMode"] = CONFIG.A5E.ROLL_MODE[rollMode.toUpperCase()];
      }

      actor.rollSavingThrow(ability, options);
    }

    return {
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
      onRollAbilityCheck,
      onRollSavingThrow,
    };
  },
};
</script>
