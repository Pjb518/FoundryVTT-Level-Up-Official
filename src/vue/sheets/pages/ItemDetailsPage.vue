<template>
  <div class="u-flex u-flex-col u-gap-xl">
    <feature-configuration v-if="item.type === 'feature'" />
    <maneuver-configuration v-else-if="item.type === 'maneuver'" />

    <template v-else-if="item.type === 'object'">
      <object-configuration />
      <material-configuration />
      <ammunition-configuration v-if="data.data.objectType === 'ammunition'" />
      <armor-configuration v-else-if="data.data.objectType === 'armor'" />
      <weapon-configuration v-else-if="data.data.objectType === 'weapon'" />
    </template>

    <spell-configuration v-else-if="item.type === 'spell'" />
    <activation-configuration />
    <resource-configuration />

    <hr class="a5e-rule" />

    <form-section
      heading="A5E.ActionOptions"
      hint="Activate specialized configuration options by toggling the tags above."
    >
      <checkbox-group
        :document="item"
        :options="Object.entries(config.actionOptions)"
        updatePath="data.actionOptions"
      />
    </form-section>

    <form-section
      v-if="
        ['attack', 'damage', 'healing'].some((option) =>
          data.data.actionOptions.includes(option)
        )
      "
      heading="A5E.AbilityScore"
      hint="The selected ability is used to determine the attack roll formula for the weapon (if it has one). You can also use @mod to reference the modifier for the selected ability in roll formulae."
    >
      <radio-group
        :document="item"
        :options="[[null, 'A5E.None'], ...Object.entries(config.abilities)]"
        updatePath="data.ability"
      />
    </form-section>

    <ability-check-configuration
      v-if="data.data.actionOptions.includes('abilityCheck')"
    />

    <attack-configuration v-if="data.data.actionOptions.includes('attack')" />
    <damage-configuration v-if="data.data.actionOptions.includes('damage')" />
    <healing-configuration v-if="data.data.actionOptions.includes('healing')" />

    <saving-throw-configuration
      v-if="data.data.actionOptions.includes('savingThrow')"
    />
  </div>
</template>

<script>
import { inject } from "vue";

import AbilityCheckConfiguration from "./partials/config/AbilityCheckConfiguration.vue";
import ActivationConfiguration from "./partials/config/ActivationConfiguration.vue";
import AmmunitionConfiguration from "./partials/config/AmmunitionConfiguration.vue";
import ArmorConfiguration from "./partials/config/ArmorConfiguration.vue";
import AttackConfiguration from "./partials/config/AttackConfiguration.vue";
import CheckboxGroup from "../../forms/CheckboxGroup.vue";
import DamageConfiguration from "./partials/config/DamageConfiguration.vue";
import FormSection from "../../forms/FormSection.vue";
import FeatureConfiguration from "./partials/config/FeatureConfiguration.vue";
import HealingConfiguration from "./partials/config/HealingConfiguration.vue";
import ManeuverConfiguration from "./partials/config/ManeuverConfiguration.vue";
import MaterialConfiguration from "./partials/config/MaterialConfiguration.vue";
import ObjectConfiguration from "./partials/config/ObjectConfiguration.vue";
import RadioGroup from "../../forms/RadioGroup.vue";
import ResourceConfiguration from "./partials/config/ResourceConfiguration.vue";
import SavingThrowConfiguration from "./partials/config/SavingThrowConfiguration.vue";
import SpellConfiguration from "./partials/config/SpellConfiguration.vue";
import WeaponConfiguration from "./partials/config/WeaponConfiguration.vue";

export default {
  components: {
    AbilityCheckConfiguration,
    ActivationConfiguration,
    AmmunitionConfiguration,
    ArmorConfiguration,
    AttackConfiguration,
    CheckboxGroup,
    DamageConfiguration,
    FeatureConfiguration,
    FormSection,
    HealingConfiguration,
    ManeuverConfiguration,
    MaterialConfiguration,
    ObjectConfiguration,
    RadioGroup,
    ResourceConfiguration,
    SavingThrowConfiguration,
    SpellConfiguration,
    WeaponConfiguration,
  },
  setup() {
    const data = inject("data");
    const item = inject("item");

    return {
      config: CONFIG.A5E,
      data,
      item,
    };
  },
};
</script>
