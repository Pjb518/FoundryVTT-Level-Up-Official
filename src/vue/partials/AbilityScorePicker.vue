<template>
  <section class="a5e-form__section">
    <h3 class="a5e-form__input-label">{{ heading }}</h3>

    <div class="a5e-radio-group">
      <template v-for="ability in abilities" :key="ability.name">
        <input
          class="a5e-u-hidden"
          type="radio"
          name="ability"
          :value="ability.name"
          :id="appId + '-' + ability.name"
          v-model="selectedAbility"
        />

        <label
          class="a5e-radio-group__button"
          :for="appId + '-' + ability.name"
        >
          {{ ability.localized }}
        </label>
      </template>
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";
import A5E from "../../modules/config";

export default {
  props: { appId: String },
  setup(_, context) {
    const heading = game.i18n.localize("A5E.AbilityScore");

    const abilities = [
      { name: "none", localized: game.i18n.localize("A5E.None") },
      ...Object.entries(A5E.abilityAbbreviations).map(([name, i18nKey]) => ({
        name,
        localized: game.i18n.localize(i18nKey),
      })),
    ];

    const selectedAbility = ref("none");

    watch(selectedAbility, (curr) => {
      context.emit("update-selected-ability", curr === "none" ? null : curr);
    });

    return {
      abilities,
      heading,
      selectedAbility,
    };
  },
};
</script>
