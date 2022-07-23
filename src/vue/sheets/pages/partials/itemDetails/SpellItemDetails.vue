<template>
  <div class="u-flex u-flex-col u-gap-xs u-text-sm">
    <div class="u-flex u-gap-ch u-text-italic">
      {{ localize(config.spellLevels[item.system.level]) }}

      <div class="u-flex" v-if="spellSchools.length">({{ spellSchools }})</div>
    </div>

    <dl class="u-flex u-flex-col u-gap-xs u-m-0 u-p-0">
      <div
        v-if="item.system.activation.type"
        class="u-align-center u-flex u-gap-ch"
      >
        <dt>{{ localize("A5E.SpellCastingTime") }}:</dt>
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

          <template v-if="item.system.ritual">
            ({{ localize("A5E.SpellRitual").toLowerCase() }})
          </template>

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

      <div v-if="rangeSummary" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemRange") }}:</dt>
        <dd class="u-m-0 u-p-0">{{ rangeSummary }}</dd>
      </div>

      <div v-if="item.system.area.shape" class="u-align-center u-flex u-gap-ch">
        <dt>{{ localize("A5E.TargetArea") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ areaSummary }}
        </dd>
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

      <div
        v-if="Object.values(item.system.components).some(Boolean)"
        class="u-flex u-gap-ch"
      >
        <dt>{{ localize("A5E.SpellComponents") }}:</dt>
        <dd class="u-flex u-gap-ch u-m-0 u-p-0">
          <ul
            class="
              u-comma-list
              u-flex
              u-flex-shrink-0
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
              u-w-fit
            "
          >
            <li
              v-for="[component] in Object.entries(
                item.system.components
              ).filter(([_, state]) => state)"
              :key="component"
            >
              {{
                localize(
                  `${config.spellComponents[component]}Abbr` ?? component
                )
              }}
            </li>
          </ul>

          <span v-if="item.system.components.material && item.system.materials">
            ({{ item.system.materials }})
          </span>
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
import prepareAreaSummary from "../../../../utils/dataPreparationHelpers/prepareAreaSummary";
import prepareRangeSummary from "../../../../utils/dataPreparationHelpers/prepareRangeSummary";

export default {
  props: { item: Object },
  setup(props) {
    const areaSummary = computed(() =>
      prepareAreaSummary(props.item.system.area)
    );

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

    const spellSchools = computed(() => {
      const itemData = props.item.system;
      const schools = [];

      if (itemData.schools.primary) {
        schools.push(
          game.i18n.localize(
            CONFIG.A5E.spellSchools.primary[itemData.schools.primary] ??
              itemData.schools.primary
          )
        );
      }

      if (itemData.schools.secondary.length) {
        const secondarySchools = itemData.schools.secondary.map((school) =>
          game.i18n.localize(
            CONFIG.A5E.spellSchools.secondary[school] ?? school
          )
        );

        schools.push(...secondarySchools);
      }

      return schools.map((school) => school.toLowerCase()).join(", ");
    });

    return {
      areaSummary,
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      rangeSummary,
      showActivationCost,
      showDurationValue,
      showTargetQuantity,
      spellSchools,
    };
  },
};
</script>
