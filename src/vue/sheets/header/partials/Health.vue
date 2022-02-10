<template>
  <div class="a5e-health-container">
    <meter class="a5e-health-bar" min="0" :max="hp.max" :value="hp.value">
      {{ hp.value }} / {{ hp.max }}
    </meter>

    <div class="a5e-health-bar__text">
      <input
        class="a5e-health-bar__current-hp"
        type="number"
        name="data.attributes.hp.value"
        :value="hp.value"
        placeholder="0"
        min="0"
        data-dtype="Number"
      />
      /
      <input
        class="a5e-health-bar__max-hp"
        type="number"
        name="data.attributes.hp.max"
        :value="hp.max"
        placeholder="0"
        data-dtype="Number"
        min="0"
        disabled
      />
    </div>

    <div class="a5e-health-bar__text a5e-health-bar__text--secondary">
      <input
        class="a5e-health-bar__temp-hp"
        type="number"
        name="data.attributes.hp.temp"
        data-dtype="Number"
        min="0"
        :value="hp.temp || ''"
        :placeholder="localize('A5E.HitPointsTemporaryLabel')"
      />

      <input
        class="a5e-health-bar__bonus-hp"
        type="number"
        name="data.attributes.hp.bonus"
        data-dtype="Number"
        :value="hp.bonus || ''"
        :placeholder="localize('A5E.HitPointsMaxModifierLabel')"
      />
    </div>

    <div class="a5e-health-bar__rest-button" @click="onClickRestButton">
      <i class="fas fa-campground"></i>

      <div class="a5e-tooltip a5e-tooltip--health a5e-tooltip--obstacle-left">
        {{ localize("A5E.Rest") }}
      </div>
    </div>

    <div
      v-if="sheetIsLocked"
      class="a5e-config-button--health u-font-serif u-text-medium"
    >
      {{ remainingHitDice }}

      <div class="a5e-tooltip a5e-tooltip--health">
        {{ localize("A5E.HitDiceRemaining") }}
      </div>
    </div>

    <div
      v-else
      class="a5e-config-button a5e-config-button--health"
      @click="onClickConfigButton"
    >
      <i class="fas fa-cog"></i>

      <div class="a5e-tooltip a5e-tooltip--health">
        {{ localize("A5E.HitPointsConfigurationTooltip") }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";

export default {
  props: { hp: Object, sheetIsLocked: Boolean },
  setup() {
    const actor = inject("actor");
    const data = inject("data");

    const remainingHitDice = computed(() =>
      Object.values(data.value.data.attributes.hitDice).reduce(
        (acc, { current }) => (acc += current),
        0
      )
    );

    function onClickConfigButton() {
      actor.configureHealth();
    }

    function onClickRestButton() {
      actor.triggerRest();
    }

    return {
      data,
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
      onClickRestButton,
      remainingHitDice,
    };
  },
};
</script>
