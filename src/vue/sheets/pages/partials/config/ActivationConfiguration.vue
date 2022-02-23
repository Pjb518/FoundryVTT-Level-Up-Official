<template>
  <section>
    <header
      class="
        u-align-center
        u-flex
        u-font-serif
        u-gap-md
        u-mb-lg
        u-ml-xs
        u-pointer
        u-text-lg
        u-w-fit
      "
      @click="editModeActive = !editModeActive"
    >
      <h3>{{ localize("A5E.ActivationConfiguration") }}</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.ItemActivationCost">
        <div class="u-align-center u-flex u-gap-lg u-w-full">
          <div v-if="showActivationCost" class="u-text-center u-text-sm u-w-20">
            <input
              type="number"
              name="data.activation.cost"
              :value="data.data.activation.cost"
              data-dtype="Number"
            />
          </div>

          <select class="u-w-fit" name="data.activation.type">
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(
                config.abilityActivationTypes
              )"
              :key="key"
              :value="key"
              :selected="data.data.activation.type === key"
            >
              {{ localize(name) }}
            </option>
          </select>
        </div>
      </form-section>

      <form-section
        heading="A5E.ActionActivationReactionTrigger"
        v-if="data.data.activation.type === 'reaction'"
      >
        <div class="u-text-sm u-w-full">
          <input
            type="text"
            name="data.activation.reactionTrigger"
            :value="data.data.activation.reactionTrigger"
            data-dtype="String"
          />
        </div>
      </form-section>

      <form-section heading="A5E.ItemDuration">
        <div class="u-align-center u-flex u-gap-lg u-w-full">
          <div v-if="showDurationValue" class="u-text-center u-text-sm u-w-20">
            <input
              type="number"
              name="data.duration.value"
              :value="data.data.duration.value"
              data-dtype="Number"
            />
          </div>

          <select class="u-w-fit" name="data.duration.unit">
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(config.timePeriods)"
              :key="key"
              :value="key"
              :selected="data.data.duration.unit === key"
            >
              {{ localize(name) }}
            </option>
          </select>
        </div>
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemActivationCost") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showActivationCost && data.data.activation.cost">
            {{ data.data.activation.cost }}
          </template>

          {{
            localize(
              data.data.activation.type
                ? config.abilityActivationTypes[data.data.activation.type]
                : "A5E.None"
            )
          }}

          <template
            v-if="
              data.data.activation.type === 'reaction' &&
              data.data.activation.reactionTrigger
            "
          >
            ({{ data.data.activation.reactionTrigger }})
          </template>
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemDuration") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="data.data.duration.unit">
            <template v-if="showDurationValue && data.data.duration.value">
              {{ data.data.duration.value }}
            </template>

            {{ localize(config.timePeriods[data.data.duration.unit]) }}
          </template>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
import { computed, inject, ref } from "vue";

import FormSection from "../../../../forms/FormSection.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";
import RangeIncrement from "./RangeIncrement.vue";

export default {
  components: { FormSection, RadioGroup, RangeIncrement },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    const showActivationCost = computed(() => {
      const activationType = data.value.data.activation.type;

      if (!activationType) return false;

      if (["none", "special"].includes(activationType)) {
        return false;
      }

      return true;
    });

    const showDurationValue = computed(() => {
      const durationUnit = data.value.data.duration.unit;

      if (!durationUnit) return false;
      if (["instantaneous", "permanent", "special"].includes(durationUnit))
        return false;

      return true;
    });

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      showActivationCost,
      showDurationValue,
    };
  },
};
</script>
