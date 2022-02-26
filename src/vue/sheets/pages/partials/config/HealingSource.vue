<template>
  <form-section>
    <div class="u-flex u-flex-wrap u-gap-md u-pos-relative u-w-full">
      <div class="u-flex u-flex-col u-gap-md u-w-full">
        <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
          {{ localize("A5E.HealingLabel") }}
        </h3>

        <div class="u-flex-grow u-w-full">
          <input
            class="a5e-input"
            type="text"
            :name="`data.healing.${index}.name`"
            :value="healingRoll.name"
            data-dtype="String"
          />
        </div>
      </div>

      <div class="u-flex u-gap-lg u-w-full">
        <div class="u-flex u-flex-col u-flex-grow u-gap-md">
          <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
            {{ localize("A5E.HealingFormula") }}
          </h3>

          <div class="u-flex-grow u-w-full">
            <input
              class="a5e-input"
              type="text"
              :name="`data.healing.${index}.formula`"
              :value="healingRoll.formula"
              data-dtype="String"
            />
          </div>
        </div>

        <div class="u-flex u-flex-col u-gap-md u-w-fit">
          <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
            {{ localize("A5E.HealingType") }}
          </h3>

          <select
            class="u-h-8 u-w-fit"
            :name="`data.healing.${index}.healingType`"
          >
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(config.healingTypes)"
              :key="key"
              :value="key"
              :selected="healingRoll.healingType === key"
            >
              {{ localize(name) }}
            </option>
          </select>
        </div>
      </div>

      <i
        class="
          u-hover-scale-120
          u-hover-text-red
          u-pointer
          u-pos-absolute
          u-right-1
          u-text-medium
          u-transition
          fas
          fa-trash
        "
        @click.prevent="onDeleteHealingSource(index)"
      ></i>
    </div>
  </form-section>
</template>

<script>
import { inject } from "vue";

import FormSection from "../../../../forms/FormSection.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";

export default {
  components: { FormSection, RadioGroup },
  props: { healingRoll: Object, index: Number },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    function onDeleteHealingSource(index) {
      const { healing } = data.value.data;
      healing.splice(index, 1);

      this.item.update({ "data.healing": healing });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      item,
      localize: (key) => game.i18n.localize(key),
      onDeleteHealingSource,
    };
  },
};
</script>
