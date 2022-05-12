<template>
  <section
    class="u-gap-md u-grid u-grid-3 u-p-lg u-pb-xl u-h-full u-overflow-y-auto"
  >
    <div class="u-flex u-flex-col u-font-sans-serif u-gap-md u-mb-xl u-pb-xl">
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
        u-mb-xl
        u-p-0
        u-pb-xl
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

  <tab-footer>
    <div class="u-align-center u-flex u-gap-md u-text-md">
      <h3 class="u-mb-0">
        {{ localize("A5E.SkillPrcPassive") }}
      </h3>

      <span class="a5e-footer-group__value">{{
        data.data.skills.prc.passive
      }}</span>
    </div>

    <div class="u-align-center u-flex u-gap-md u-text-md">
      <h3 class="u-mb-0">
        {{ localize("A5E.ManeuverDC") }}
      </h3>

      <span class="a5e-footer-group__value">{{ maneuverDC }}</span>
    </div>

    <div class="u-align-center u-flex u-gap-md u-text-md">
      <h3 class="u-mb-0">
        {{ localize("A5E.XP") }}
      </h3>

      <input
        class="a5e-footer-group__input"
        type="number"
        name="data.details.xp"
        :value="data.data.details.xp"
        placeholder="0"
        min="0"
        data-dtype="Number"
        v-autowidth
      />
      /
      <span class="a5e-footer-group__value">
        {{ nextXPIncrement }}
      </span>
    </div>
  </tab-footer>
</template>

<script>
import { computed, inject } from "vue";
import { directive as VueInputAutowidth } from "vue-input-autowidth";

import calculateManeuverDC from "../../../modules/utils/calculateManeuverDC";
import prepareArmorProficiencies from "../../utils/dataPreparationHelpers/prepareArmorProficiencies";
import prepareConditionImmunities from "../../utils/dataPreparationHelpers/prepareConditionImmunities";
import prepareDamageImmunities from "../../utils/dataPreparationHelpers/prepareDamageImmunities";
import prepareDamageResistances from "../../utils/dataPreparationHelpers/prepareDamageResistances";
import prepareDamageVulnerabilities from "../../utils/dataPreparationHelpers/prepareDamageVulnerabilities";
import prepareLanguageProficiencies from "../../utils/dataPreparationHelpers/prepareLanguageProficiencies";
import prepareSenses from "../../utils/dataPreparationHelpers/prepareSenses";
import prepareToolProficiencies from "../../utils/dataPreparationHelpers/prepareToolProficiencies";
import prepareWeaponProficiencies from "../../utils/dataPreparationHelpers/prepareWeaponProficiencies";

import DetailsCategory from "./partials/DetailsCategory.vue";
import Skill from "./partials/Skill.vue";
import TabFooter from "./partials/TabFooter.vue";

export default {
  components: { DetailsCategory, Skill, TabFooter },
  directives: { autowidth: VueInputAutowidth },
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
    const maneuverDC = computed(() => calculateManeuverDC(data.value));

    const nextXPIncrement = computed(() => {
      let level = data.value.data.details.level;

      if (level < 1) level = 1;
      else if (level > 19) level = 19;

      return CONFIG.A5E.CHARACTER_EXP_LEVELS[level.toString()];
    });

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
      localize: (key) => game.i18n.localize(key),
      maneuverDC,
      nextXPIncrement,
      onClickConfigButton,
      senses,
      toolProficiencies,
      weaponProficiencies,
    };
  },
};
</script>
