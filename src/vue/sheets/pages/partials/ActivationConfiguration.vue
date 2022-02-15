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

      <form-section heading="A5E.ItemRange">
        <div class="u-align-center u-flex u-gap-lg u-w-full">
          <select class="u-flex-shrink-0 u-w-30" name="data.range.category">
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(config.rangeDescriptors)"
              :key="key"
              :value="key"
              :selected="data.data.range.category === key"
            >
              {{ localize(name) }}
            </option>
          </select>

          <div
            v-if="data.data.range.category === 'other'"
            class="u-text-sm u-w-full"
          >
            <input
              type="text"
              name="data.range.custom"
              :value="data.data.range.custom"
              data-dtype="String"
            />
          </div>
        </div>
      </form-section>

      <form-section heading="A5E.ItemAreaShape">
        <div
          class="u-align-center u-flex u-font-serif u-gap-xl u-text-md u-w-full"
        >
          <label
            class="
              a5e-radio-group__button a5e-radio-group__button--area-templates
            "
            :class="{
              'u-bg-green u-hover-bg-green u-text-light': selectedArea === null,
            }"
            @click="onSelectArea(null)"
          >
            <i class="fas fa-times-circle"></i>
            {{ localize("A5E.None") }}
          </label>

          <label
            v-for="[key, name] in Object.entries(config.areaTypes)"
            :key="key"
            class="
              a5e-radio-group__button a5e-radio-group__button--area-templates
            "
            :class="{
              'u-bg-green u-hover-bg-green u-text-light': selectedArea === key,
            }"
            @click="onSelectArea(key)"
          >
            <span class="u-text-sm" v-html="config.areaIcons[key]"></span>
            {{ localize(name) }}
          </label>
        </div>
      </form-section>

      <form-section v-if="data.data.area.shape" heading="A5E.ItemAreaSize">
        <div class="u-w-full">
          <input
            class="a5e-input"
            name="data.area.size"
            type="text"
            :value="data.data.area.size"
          />
        </div>
      </form-section>

      <form-section heading="A5E.ItemTarget">
        <div class="u-align-center u-flex u-gap-lg u-w-full">
          <div v-if="showTargetQuantity" class="u-text-center u-text-sm u-w-20">
            <input
              type="number"
              name="data.target.quantity"
              :value="data.data.target.quantity"
              data-dtype="Number"
            />
          </div>

          <select class="u-w-fit" name="data.target.type">
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(config.targetTypes)"
              :key="key"
              :value="key"
              :selected="data.data.target.type === key"
            >
              {{ localize(name) }}
            </option>
          </select>
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
        <dt class="u-text-bold">{{ localize("A5E.ItemActivationCost") }}.</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="showActivationCost && data.data.activation.cost">
            {{ data.data.activation.cost }}
          </template>

          {{
            localize(config.abilityActivationTypes[data.data.activation.type])
          }}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemRange") }}.</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="data.data.range.category === 'other'">
            {{ data.data.range.custom }}
          </template>

          <template v-else-if="data.data.range.category">
            {{ localize(config.rangeDescriptors[data.data.range.category]) }}

            <template
              v-if="
                config.rangeValues[data.data.range.category] &&
                config.rangeValues[data.data.range.category] !==
                  config.rangeDescriptors[data.data.range.category]
              "
            >
              ({{ config.rangeValues[data.data.range.category] }} ft.)
            </template>
          </template>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.TargetArea") }}.</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="data.data.area.shape">
            {{ localize(config.areaTypes[data.data.area.shape]) }}

            <template v-if="data.data.area.size">
              ({{ data.data.area.size }})
            </template>
          </template>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemTarget") }}.</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="data.data.target.type">
            <template v-if="showTargetQuantity && data.data.target.quantity">
              {{ data.data.target.quantity }} &#10761;
            </template>

            {{ localize(config.targetTypes[data.data.target.type]) }}
          </template>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemDuration") }}.</dt>
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

import FormSection from "../../../forms/FormSection.vue";
import RadioGroup from "../../../forms/RadioGroup.vue";

export default {
  components: { FormSection, RadioGroup },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    const selectedArea = computed(() => {
      if (
        Object.keys(CONFIG.A5E.areaTypes).includes(data.value.data.area.shape)
      )
        return data.value.data.area.shape;

      return null;
    });

    const showActivationCost = computed(() => {
      const activationType = data.value.data.activation.type;

      if (!activationType) return false;
      if (["none", "special"].includes(activationType)) return false;

      return true;
    });

    const showTargetQuantity = computed(() => {
      const targetType = data.value.data.target.type;

      if (!targetType) return false;
      if (["other", "self"].includes(targetType)) return false;

      return true;
    });

    const showDurationValue = computed(() => {
      const durationUnit = data.value.data.duration.unit;

      if (!durationUnit) return false;
      if (["instantaneous", "permanent", "special"].includes(durationUnit))
        return false;

      return true;
    });

    function onSelectArea(areaType) {
      item.update({ "data.area.shape": areaType });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      onSelectArea,
      selectedArea,
      showActivationCost,
      showDurationValue,
      showTargetQuantity,
    };
  },
};
</script>
