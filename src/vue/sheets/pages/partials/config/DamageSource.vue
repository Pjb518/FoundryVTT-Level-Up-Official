<template>
  <form-section>
    <div class="u-flex u-flex-wrap u-gap-md u-pos-relative u-w-full">
      <div class="u-flex u-flex-col u-gap-md u-w-full">
        <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
          {{ localize("A5E.DamageLabel") }}
        </h3>

        <div class="u-flex-grow u-w-full">
          <input
            class="a5e-input"
            type="text"
            :name="`data.damage.${index}.name`"
            :value="damageRoll.name"
            data-dtype="String"
          />
        </div>
      </div>

      <div class="u-flex u-gap-lg u-w-full">
        <div class="u-flex u-flex-col u-flex-grow u-gap-md">
          <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
            {{ localize("A5E.DamageFormula") }}
          </h3>

          <div class="u-flex-grow u-w-full">
            <input
              class="a5e-input"
              type="text"
              :name="`data.damage.${index}.formula`"
              :value="damageRoll.formula"
              data-dtype="String"
            />
          </div>
        </div>

        <div class="u-flex u-flex-col u-gap-md u-w-fit">
          <h3 class="u-text-bold u-text-sm u-flex-shrink-0 u-mb-0">
            {{ localize("A5E.DamageType") }}
          </h3>

          <select
            class="u-h-8 u-w-fit"
            :name="`data.damage.${index}.damageType`"
          >
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(config.damageTypes)"
              :key="key"
              :value="key"
              :selected="damageRoll.damageType === key"
            >
              {{ localize(name) }}
            </option>
          </select>
        </div>
      </div>

      <div class="u-align-center u-flex u-gap-md u-w-full">
        <input
          class="u-pointer"
          type="checkbox"
          :name="`data.damage.${index}.canCrit`"
          :id="`${appId}-${index}-canCrit`"
          :checked="data.data.damage[index].canCrit"
        />

        <label class="u-pointer" :for="`${appId}-${index}-canCrit`">
          {{ localize("A5E.DamageDoubleOnCrit") }}
        </label>
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
        @click.prevent="onDeleteDamageSource(index)"
      ></i>
    </div>
  </form-section>
</template>

<script>
import { inject } from "vue";

import FormSection from "../../../../forms/FormSection.vue";

export default {
  components: { FormSection },
  props: { damageRoll: Object, index: Number },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    function onDeleteDamageSource(index) {
      const { damage } = data.value.data;
      damage.splice(index, 1);

      item.update({ "data.damage": damage });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      item,
      localize: (key) => game.i18n.localize(key),
      onDeleteDamageSource,
    };
  },
};
</script>
