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
      <h3>Saving Throw Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.ItemSavingThrowType">
        <update-wrapper
          :document="item"
          updatePath="data.rarity"
          v-slot="slotProps"
        >
          <radio-group
            :options="Object.entries(config.abilities)"
            :selected="data.data.save.targetAbility"
            :selectionHandler="slotProps.selectionHandler"
          />
        </update-wrapper>
      </form-section>

      <form-section heading="A5E.ItemSavingThrowDC">
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-w-20">
            <input
              type="number"
              data-dtype="Number"
              name="data.save.dc"
              :id="`${appId}-save-dc`"
              :value="data.data.save.dc"
            />
          </div>
        </div>
      </form-section>

      <form-section heading="A5E.ItemEffectOnSave">
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-w-full">
            <input
              class="a5e-input"
              type="text"
              name="data.save.onSave"
              :id="`${appId}-onSave`"
              :value="data.data.save.onSave"
              data-dtype="String"
            />
          </div>
        </div>
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemSavingThrowType") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <div class="u-flex u-gap-ch" v-if="data.data.save.dc">
            <span>DC {{ data.data.save.dc }}</span>

            <span v-if="data.data.save.targetAbility">
              ({{ localize(config.abilities[data.data.save.targetAbility]) }})
            </span>
          </div>
        </dd>
      </div>

      <div
        v-if="
          data.data.actionOptions.includes('savingThrow') &&
          data.data.save.onSave
        "
        class="u-flex u-gap-md"
      >
        <dt class="u-text-bold">{{ localize("A5E.ItemEffectOnSave") }}:</dt>
        <dd class="u-m-0 u-p-0">
          <div class="u-flex u-gap-ch">
            <span v-if="data.data.save.targetAbility">
              {{ data.data.save.onSave }}
            </span>
          </div>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
import { inject, ref } from "vue";

import FormSection from "../../../../forms/FormSection.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";
import UpdateWrapper from "../../../../forms/UpdateWrapper.vue";

export default {
  components: { FormSection, RadioGroup, UpdateWrapper },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
