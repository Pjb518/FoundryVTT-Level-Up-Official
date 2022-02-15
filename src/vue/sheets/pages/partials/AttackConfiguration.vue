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
      <h3>Attack Configuration</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.AttackType">
        <div class="u-align-center u-flex u-gap-lg u-w-full">
          <select class="u-w-fit" name="data.attack.type">
            <option value=""></option>

            <option
              v-for="[key, name] in Object.entries(config.attackTypes)"
              :key="key"
              :value="key"
              :selected="data.data.attack.type === key"
            >
              {{ localize(name) }}
            </option>
          </select>
        </div>
      </form-section>

      <form-section
        heading="A5E.AttackBonus"
        hint="E.g. Bonuses to hit from a magic weapon."
      >
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-w-full">
            <input
              class="a5e-input"
              type="text"
              name="data.attack.bonus"
              :id="`${appId}-attackBonus`"
              :value="data.data.attack.bonus"
            />
          </div>
        </div>
      </form-section>

      <form-section heading="A5E.CriticalHitThreshold">
        <div
          class="
            u-align-center
            u-flex
            u-flex-wrap
            u-gap-md
            u-text-center
            u-text-sm
            u-w-full
          "
        >
          <div class="u-w-20">
            <input
              type="text"
              name="data.attack.critThreshold"
              :id="`${appId}-critThreshold`"
              :value="data.data.attack.critThreshold"
            />
          </div>
        </div>
      </form-section>

      <form-section>
        <div class="u-align-center u-flex u-gap-md">
          <input
            class="u-pointer"
            type="checkbox"
            name="data.proficient"
            :id="`${appId}-proficient`"
            :checked="data.data.proficient"
          />

          <label class="u-pointer" :for="`${appId}-proficient`">
            {{ localize("A5E.AddProficiency") }}
          </label>
        </div>
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.AttackType") }}.</dt>
        <dd class="u-m-0 u-p-0">
          <template v-if="data.data.attack.type">
            {{
              localize(config.attackTypes[data.data.attack.type] ?? "A5E.None")
            }}
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
import { inject, ref } from "vue";

import FormSection from "../../../forms/FormSection.vue";
import RadioGroup from "../../../forms/RadioGroup.vue";

export default {
  components: { FormSection, RadioGroup },
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
