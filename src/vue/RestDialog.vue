<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <section class="a5e-form__section">
      <h3 class="u-text-bold u-text-sm">
        {{ localize("A5E.RestType") }}
      </h3>

      <radio-group
        initialSelection="short"
        :baseId="appId"
        :values="restTypeOptions"
        :wide="true"
        :wrap="false"
        @updateSelection="updateRestType"
      />
    </section>

    <div
      v-if="restType === 'long'"
      class="a5e-form__section a5e-form__section--inline"
    >
      <label class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
        {{ havenLabel }}
      </label>

      <div class="a5e-input-container a5e-input-container--inline-wide">
        <input type="checkbox" v-model="haven" />
      </div>
    </div>

    <div
      v-if="restType === 'long'"
      class="a5e-form__section a5e-form__section--inline"
    >
      <label class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
        {{ supplyLabel }}
      </label>

      <div class="a5e-input-container a5e-input-container--inline-wide">
        <input type="checkbox" v-model="supply" />
      </div>
    </div>

    <div v-if="restType === 'short'" class="a5e-form__section">
      <h3 class="u-text-bold u-text-sm">{{ hitDiceLabel }}</h3>

      <div class="u-flex u-gap-md u-text-md">
        <div
          class="a5e-hit-die-wrapper"
          v-for="die in ['d6', 'd8', 'd10', 'd12']"
          :key="die"
        >
          <div
            class="a5e-hit-die a5e-hit-die--rollable"
            :class="{
              [`a5e-hit-die--${die}`]: true,
              'a5e-hit-die--disabled': hitDice[die].value == 0,
            }"
            @click="rollHitDie(die)"
          >
            <span class="a5e-hit-die__label">{{ die }}</span>
          </div>

          <span class="a5e-hit-die__quantity">
            {{ hitDice[die] }}
          </span>
        </div>
      </div>
    </div>

    <button class="a5e-button">
      <i class="fas fa-campground"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import NumericField from "./partials/NumericField.vue";
import RadioGroup from "./partials/RadioGroup.vue";

import { ref } from "vue";

export default {
  components: { NumericField, RadioGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;
    const appId = appWindow.id;
    const { hitDice } = actorData.attributes;

    const d6 = ref(parseInt(hitDice.d6.current || 0, 10));
    const d8 = ref(parseInt(hitDice.d8.current || 0, 10));
    const d10 = ref(parseInt(hitDice.d10.current || 0, 10));
    const d12 = ref(parseInt(hitDice.d12.current || 0, 10));

    const restTypeOptions = [
      {
        id: "short",
        value: "short",
        name: game.i18n.localize("A5E.RestShort"),
      },
      {
        id: "long",
        value: "long",
        name: game.i18n.localize("A5E.RestLong"),
      },
    ];

    const restType = ref("short");
    const haven = ref(true);
    const supply = ref(true);

    async function rollHitDie(dieSize) {
      try {
        await actor.rollHitDice(dieSize);
      } catch {
        // TODO: Display a useful error to the user when hit die updates fail
        return;
      }

      // Update hit dice quantities for display purposes only
      updateHitDice(dieSize);
    }

    function updateHitDice(dieSize) {
      if (dieSize === "d6") d6.value = Math.max(d6.value - 1, 0);
      if (dieSize === "d8") d8.value = Math.max(d8.value - 1, 0);
      if (dieSize === "d10") d10.value = Math.max(d10.value - 1, 0);
      if (dieSize === "d12") d12.value = Math.max(d12.value - 1, 0);
    }

    function updateRestType(value) {
      restType.value = value;
    }

    function onSubmit() {
      actor.update();
      appWindow.submit({
        haven: restType.value === "long" ? haven.value : null,
        restType: restType.value,
        supply: restType.value === "long" ? supply.value : null,
      });
    }

    return {
      appId,
      haven,
      havenLabel: game.i18n.localize("A5E.HavenPrompt"),
      hitDice: {
        d6,
        d8,
        d10,
        d12,
      },
      hitDiceLabel: game.i18n.localize("A5E.HitDiceLabel"),
      localize: (key) => game.i18n.localize(key),
      onSubmit,
      restType,
      restTypeOptions,
      rollHitDie,
      submitText: game.i18n.localize("A5E.Rest"),
      supply,
      supplyLabel: game.i18n.localize("A5E.SupplyPrompt"),
      updateRestType,
    };
  },
};
</script>
