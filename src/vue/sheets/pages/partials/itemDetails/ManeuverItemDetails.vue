<template>
  <div class="u-flex u-flex-col u-gap-xs u-text-sm">
    <div class="u-flex u-gap-ch u-text-italic">
      {{ localize(config.maneuverDegrees[item.system.degree]) }}

      <div v-if="maneuverTradition">({{ maneuverTradition }})</div>
    </div>

    <dl class="u-flex u-flex-col u-gap-xs u-m-0 u-p-0">
      <div
        v-if="item.system.activation.type"
        class="u-align-center u-flex u-gap-ch"
      >
        <dt>{{ localize("A5E.ActionActivationCost") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showActivationCost && item.system.activation.cost">
            {{ item.system.activation.cost }}
          </template>

          {{
            localize(
              item.system.activation.type
                ? config.abilityActivationTypes[item.system.activation.type]
                : "A5E.None"
            )
          }}

          <template
            v-if="
              item.system.activation.type === 'reaction' &&
              item.system.activation.reactionTrigger
            "
          >
            ({{ item.system.activation.reactionTrigger }})
          </template>
        </dd>
      </div>

      <div v-if="item.system.exertionCost" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ExertionCost") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ item.system.exertionCost }} {{ localize("A5E.Exertion") }}
        </dd>
      </div>

      <div v-if="rangeSummary" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemRange") }}:</dt>
        <dd class="u-m-0 u-p-0">{{ rangeSummary }}</dd>
      </div>

      <div v-if="item.system.target.type" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemTarget") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showTargetQuantity && item.system.target.quantity">
            {{ item.system.target.quantity }} &#10761;
          </template>

          {{ localize(config.targetTypes[item.system.target.type]) }}
        </dd>
      </div>

      <div v-if="item.system.duration.unit" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemDuration") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showDurationValue && item.system.duration.value">
            {{ item.system.duration.value }}
          </template>

          {{ localize(config.timePeriods[item.system.duration.unit]) }}

          <span v-if="item.system.concentration">
            ({{ localize("A5E.SpellConcentration").toLowerCase() }})
          </span>
        </dd>
      </div>

      <div
        v-if="
          item.system.actionOptions.includes('savingThrow') &&
          item.system.save.targetAbility
        "
        class="u-flex u-gap-ch"
      >
        <dt class="u-text-bold">{{ localize("A5E.SavingThrow") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <div class="u-flex u-gap-ch">
            <span>
              {{ localize(config.abilities[item.system.save.targetAbility]) }}
            </span>

            <span> ({{ item.system.save.onSave }}) </span>
          </div>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { computed } from "vue";

import prepareRangeSummary from "../../../../utils/dataPreparationHelpers/prepareRangeSummary";

export default {
  props: { item: Object },
  setup(props) {
    const rangeSummary = computed(() =>
      prepareRangeSummary(props.item.system.range)
    );

    const showActivationCost = computed(() => {
      const activationType = props.item.system.activation.type;

      if (!activationType) return false;

      if (["none", "special"].includes(activationType)) {
        return false;
      }

      return true;
    });

    const showDurationValue = computed(() => {
      const durationUnit = props.item.system.duration.unit;

      if (!durationUnit) return false;
      if (["instantaneous", "permanent", "special"].includes(durationUnit))
        return false;

      return true;
    });

    const showTargetQuantity = computed(() => {
      const targetType = props.item.system.target.type;

      if (!targetType) return false;
      if (["other", "self"].includes(targetType)) return false;

      return true;
    });

    const maneuverTradition = computed(() =>
      props.item.system.degree > 0 && props.item.system.tradition
        ? game.i18n.localize(
            CONFIG.A5E.maneuverTraditions[props.item.system.tradition]
          )
        : null
    );

    return {
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      rangeSummary,
      showActivationCost,
      showDurationValue,
      showTargetQuantity,
      maneuverTradition,
    };
  },
};
</script>
