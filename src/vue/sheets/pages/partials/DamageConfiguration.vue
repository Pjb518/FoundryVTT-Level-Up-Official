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
      <h3>Damage Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <template v-if="data.data.damage.length">
        <damage-source
          v-for="(damageRoll, index) in data.data.damage"
          :key="`damage-roll-${index}`"
          v-bind="{ damageRoll, index }"
        />
      </template>

      <button
        class="a5e-button a5e-button--no-shadow u-bg-green u-text-light"
        @click.prevent="onAddDamageSource"
      >
        + {{ localize("A5E.DamageAddSource") }}
      </button>
    </div>

    <template v-else>
      <div class="u-flex u-flex-col u-gap-md">
        <dl
          v-for="(damageRoll, index) in data.data.damage"
          :key="`damage-summary-${index}`"
          class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
        >
          <div class="u-flex u-gap-md">
            <dt class="u-text-bold">
              {{
                damageRoll.name || `${localize("A5E.Damage")} #${index + 1}`
              }}:
            </dt>

            <dd class="u-m-0 u-p-0">
              {{ damageRoll.formula || 0 }}
            </dd>
          </div>

          <div class="u-flex u-gap-md">
            <dt class="u-text-bold">{{ localize("A5E.DamageType") }}:</dt>

            <dd class="u-m-0 u-p-0">
              {{
                localize(
                  config.damageTypes[damageRoll.damageType] ?? "A5E.None"
                )
              }}
            </dd>
          </div>
        </dl>
      </div>
    </template>
  </section>
</template>

<script>
import { inject, ref } from "vue";

import DamageSource from "./DamageSource.vue";
import FormSection from "../../../forms/FormSection.vue";
import RadioGroup from "../../../forms/RadioGroup.vue";

export default {
  components: { DamageSource, FormSection, RadioGroup },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    function onAddDamageSource() {
      const damage = data.value.data.damage ?? [];

      damage.push({
        name: "",
        formula: "",
        canCrit: !!data.value.data.actionOptions.includes("attack"),
        damageType: "",
      });

      item.update({ "data.damage": damage });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      onAddDamageSource,
    };
  },
};
</script>
