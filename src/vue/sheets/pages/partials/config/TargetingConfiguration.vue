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
      <h3>Targeting Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <template v-if="data.data.range.length">
        <range-increment
          v-for="(range, index) in data.data.range"
          :key="`range-${index}`"
          v-bind="{ index, range }"
        />
      </template>

      <button
        class="a5e-button a5e-button--no-shadow u-bg-green u-text-light"
        @click.prevent="onAddRangeIncrement"
      >
        + {{ localize("A5E.ItemRangeAddIncrement") }}
      </button>

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

      <form-section v-if="data.data.area.shape">
        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="data.area.placeTemplate"
            :id="`${appId}-place-template`"
            :checked="data.data.area.placeTemplate"
          />

          <label class="u-pointer" :for="`${appId}-place-template`">
            {{ localize("A5E.ItemPlaceTemplate") }}
          </label>
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
    </div>

    <div v-else class="u-flex u-flex-col u-gap-md">
      <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
        <div class="u-flex u-gap-md">
          <dt class="u-text-bold">{{ localize("A5E.ItemRange") }}:</dt>

          <dd class="u-m-0 u-p-0">
            {{ rangeSummary || localize("A5E.None") }}
          </dd>
        </div>

        <div class="u-flex u-gap-md">
          <dt class="u-text-bold">{{ localize("A5E.TargetArea") }}:</dt>
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
          <dt class="u-text-bold">{{ localize("A5E.ItemTarget") }}:</dt>
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
      </dl>
    </div>
  </section>
</template>

<script>
import { computed, inject, ref } from "vue";

import prepareRangeSummary from "../../../../utils/dataPreparationHelpers/prepareRangeSummary";

import RangeIncrement from "./RangeIncrement.vue";
import FormSection from "../../../../forms/FormSection.vue";

export default {
  components: { RangeIncrement, FormSection },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    const rangeSummary = computed(() =>
      prepareRangeSummary(data.value.data.range)
    );

    const selectedArea = computed(() => {
      if (
        Object.keys(CONFIG.A5E.areaTypes).includes(data.value.data.area.shape)
      )
        return data.value.data.area.shape;

      return null;
    });

    const showTargetQuantity = computed(() => {
      const targetType = data.value.data.target.type;

      if (!targetType) return false;
      if (["other", "self"].includes(targetType)) return false;

      return true;
    });

    function onAddRangeIncrement() {
      const range = data.value.data.range ?? [];
      range.push("self");

      item.update({ "data.range": range });
    }

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
      onAddRangeIncrement,
      onSelectArea,
      rangeSummary,
      selectedArea,
      showTargetQuantity,
    };
  },
};
</script>
