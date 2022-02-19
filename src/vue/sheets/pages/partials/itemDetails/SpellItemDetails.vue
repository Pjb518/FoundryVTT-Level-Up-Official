<template>
  <div class="u-flex u-flex-col u-gap-xs u-text-sm">
    <div class="u-flex u-gap-ch u-text-italic">
      {{ localize(config.spellLevels[item.data.level]) }}

      <div class="u-flex" v-if="spellSchools.length">({{ spellSchools }})</div>
    </div>

    <dl class="u-flex u-flex-col u-gap-xs u-m-0 u-p-0">
      <div
        v-if="item.data.activation.type"
        class="u-align-center u-flex u-gap-ch"
      >
        <dt>{{ localize("A5E.SpellCastingTime") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showActivationCost && item.data.activation.cost">
            {{ item.data.activation.cost }}
          </template>

          {{
            localize(
              item.data.activation.type
                ? config.abilityActivationTypes[item.data.activation.type]
                : "A5E.None"
            )
          }}

          <template v-if="item.data.ritual">
            ({{ localize("A5E.SpellRitual").toLowerCase() }})
          </template>

          <template
            v-if="
              item.data.activation.type === 'reaction' &&
              item.data.activation.reactionTrigger
            "
          >
            ({{ item.data.activation.reactionTrigger }})
          </template>
        </dd>
      </div>

      <div v-if="item.data.range.category" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemRange") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="item.data.range.category === 'other'">
            {{ item.data.range.custom }}
          </template>

          <template v-else>
            {{ localize(config.rangeDescriptors[item.data.range.category]) }}

            <template
              v-if="
                config.rangeValues[item.data.range.category] &&
                config.rangeValues[item.data.range.category] !==
                  config.rangeDescriptors[item.data.range.category]
              "
            >
              ({{ config.rangeValues[item.data.range.category] }} ft.)
            </template>
          </template>
        </dd>
      </div>

      <div v-if="item.data.area.shape" class="u-align-center u-flex u-gap-ch">
        <dt>{{ localize("A5E.TargetArea") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ localize(config.areaTypes[item.data.area.shape]) }}

          <template v-if="item.data.area.size">
            ({{ item.data.area.size }})
          </template>
        </dd>
      </div>

      <div v-if="item.data.target.type" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemTarget") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showTargetQuantity && item.data.target.quantity">
            {{ item.data.target.quantity }} &#10761;
          </template>

          {{ localize(config.targetTypes[item.data.target.type]) }}
        </dd>
      </div>

      <div
        v-if="Object.values(item.data.components).some(Boolean)"
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
              v-for="[component] in Object.entries(item.data.components).filter(
                ([_, state]) => state
              )"
              :key="component"
            >
              {{
                localize(
                  `${config.spellComponents[component]}Abbr` ?? component
                )
              }}
            </li>
          </ul>

          <span v-if="item.data.components.material && item.data.materials">
            ({{ item.data.materials }})
          </span>
        </dd>
      </div>

      <div v-if="item.data.duration.unit" class="u-flex u-gap-ch">
        <dt>{{ localize("A5E.ItemDuration") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showDurationValue && item.data.duration.value">
            {{ item.data.duration.value }}
          </template>

          {{ localize(config.timePeriods[item.data.duration.unit]) }}

          <span v-if="item.data.concentration">
            ({{ localize("A5E.SpellConcentration").toLowerCase() }})
          </span>
        </dd>
      </div>

      <div
        v-if="
          item.data.actionOptions.includes('savingThrow') &&
          item.data.save.targetAbility
        "
        class="u-flex u-gap-ch"
      >
        <dt class="u-text-bold">{{ localize("A5E.SavingThrow") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <div class="u-flex u-gap-ch">
            <span>
              {{ localize(config.abilities[item.data.save.targetAbility]) }}
            </span>

            <span> ({{ item.data.save.onSave }}) </span>
          </div>
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: { item: Object },
  setup(props) {
    const showActivationCost = computed(() => {
      const activationType = props.item.data.activation.type;

      if (!activationType) return false;

      if (["none", "special"].includes(activationType)) {
        return false;
      }

      return true;
    });

    const showDurationValue = computed(() => {
      const durationUnit = props.item.data.duration.unit;

      if (!durationUnit) return false;
      if (["instantaneous", "permanent", "special"].includes(durationUnit))
        return false;

      return true;
    });

    const showTargetQuantity = computed(() => {
      const targetType = props.item.data.target.type;

      if (!targetType) return false;
      if (["other", "self"].includes(targetType)) return false;

      return true;
    });

    const spellSchools = computed(() => {
      const itemData = props.item.data;
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
      config: CONFIG.A5E,
      localize: (key) => game.i18n.localize(key),
      showActivationCost,
      showDurationValue,
      showTargetQuantity,
      spellSchools,
    };
  },
};
</script>
