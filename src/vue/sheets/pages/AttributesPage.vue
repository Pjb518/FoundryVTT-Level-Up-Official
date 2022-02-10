<template>
  <section class="u-gap-md u-grid u-grid-3 u-p-lg u-h-full u-overflow-y-auto">
    <div class="u-font-sans-serif u-flex u-flex-col u-gap-md">
      <details-category
        category="senses"
        heading="A5E.SensesSpecial"
        :tags="senses"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="damageResistances"
        heading="A5E.DamageResistances"
        :tags="damageResistances"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="damageImmunities"
        heading="A5E.DamageImmunities"
        :tags="damageImmunities"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="damageVulnerabilities"
        heading="A5E.DamageVulnerabilities"
        :tags="damageVulnerabilities"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="conditionImmunities"
        heading="A5E.ConditionImmunities"
        :tags="conditionImmunities"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="armorProficiencies"
        heading="A5E.ArmorProficiencies"
        :tags="armorProficiencies"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="weaponProficiencies"
        heading="A5E.WeaponProficiencies"
        :tags="weaponProficiencies"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="toolProficiencies"
        heading="A5E.ToolProficiencies"
        :tags="toolProficiencies"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="languages"
        heading="A5E.Languages"
        :tags="languages"
        @open-config-window="onClickConfigButton"
      />
    </div>

    <ul
      class="
        u-flex-shrink-0
        u-gap-xs
        u-grid
        u-grid-2
        u-h-fit
        u-span-2
        u-list-style-none
        u-m-0
        u-p-0
      "
    >
      <skill
        v-for="[label, skill] in Object.entries(data.data.skills)"
        :key="label"
        :label="label"
        :skill="skill"
      />
    </ul>
  </section>
</template>

<script>
import { computed, inject } from "vue";

import prepareArmorProficiencies from "../../dataPreparationHelpers/prepareArmorProficiencies";
import prepareConditionImmunities from "../../dataPreparationHelpers/prepareConditionImmunities";
import prepareDamageImmunities from "../../dataPreparationHelpers/prepareDamageImmunities";
import prepareDamageResistances from "../../dataPreparationHelpers/prepareDamageResistances";
import prepareDamageVulnerabilities from "../../dataPreparationHelpers/prepareDamageVulnerabilities";
import prepareLanguageProficiencies from "../../dataPreparationHelpers/prepareLanguageProficiencies";
import prepareSenses from "../../dataPreparationHelpers/prepareSenses";
import prepareToolProficiencies from "../../dataPreparationHelpers/prepareToolProficiencies";
import prepareWeaponProficiencies from "../../dataPreparationHelpers/prepareWeaponProficiencies";

import DetailsCategory from "./partials/DetailsCategory.vue";
import Skill from "./partials/Skill.vue";

export default {
  components: { DetailsCategory, Skill },
  setup() {
    const actor = inject("actor");
    const data = inject("data");

    const handlers = {
      armorProficiencies: actor.configureArmorProficiencies.bind(actor),
      conditionImmunities: actor.configureConditionImmunities.bind(actor),
      damageImmunities: actor.configureDamageImmunities.bind(actor),
      damageResistances: actor.configureDamageResistances.bind(actor),
      damageVulnerabilities: actor.configureDamageVulnerabilities.bind(actor),
      languages: actor.configureLanguages.bind(actor),
      senses: actor.configureSenses.bind(actor),
      toolProficiencies: actor.configureToolProficiencies.bind(actor),
      weaponProficiencies: actor.configureWeaponProficiencies.bind(actor),
    };

    const armorProficiencies = computed(() =>
      prepareArmorProficiencies(data.value)
    );

    const conditionImmunities = computed(() =>
      prepareConditionImmunities(data.value)
    );

    const damageImmunities = computed(() =>
      prepareDamageImmunities(data.value)
    );

    const damageResistances = computed(() =>
      prepareDamageResistances(data.value)
    );

    const damageVulnerabilities = computed(() =>
      prepareDamageVulnerabilities(data.value)
    );

    const languages = computed(() => prepareLanguageProficiencies(data.value));
    const senses = computed(() => prepareSenses(data.value));

    const toolProficiencies = computed(() =>
      prepareToolProficiencies(data.value)
    );

    const weaponProficiencies = computed(() =>
      prepareWeaponProficiencies(data.value)
    );

    function onClickConfigButton(category) {
      const handler = handlers[category];
      handler();
    }

    return {
      actor,
      armorProficiencies,
      config: CONFIG.A5E,
      data,
      conditionImmunities,
      damageImmunities,
      damageResistances,
      damageVulnerabilities,
      languages,
      onClickConfigButton,
      senses,
      toolProficiencies,
      weaponProficiencies,
    };
  },
};
</script>
