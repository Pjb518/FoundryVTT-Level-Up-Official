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
      <h3>Resource Consumption</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.Uses">
        <div class="u-flex u-gap-lg u-w-full">
          <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">
              {{ localize("A5E.UsesCurrent") }}
            </h3>

            <input
              class="a5e-input"
              type="Number"
              d-type="Number"
              name="data.uses.value"
              :value="data.data.uses.value"
            />
          </div>

          <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{{ localize("A5E.UsesMax") }}</h3>

            <input
              class="a5e-input"
              type="Number"
              d-type="Number"
              name="data.uses.max"
              :value="data.data.uses.max"
            />
          </div>

          <div class="u-flex u-flex-col u-gap-xs u-w-fit">
            <h3 class="u-text-sm u-flex-shrink-0 u-mb-0">
              {{ localize("A5E.UsesPer") }}
            </h3>

            <select class="u-h-8 u-w-40" :name="`data.uses.per`">
              <option value=""></option>

              <option
                v-for="[key, name] in Object.entries(
                  config.resourceRecoveryOptions
                )"
                :key="key"
                :value="key"
                :selected="data.data.uses.per === key"
              >
                {{ localize(name) }}
              </option>
            </select>
          </div>
        </div>
      </form-section>
    </div>

    <dl v-else class="a5e-box u-flex u-gap-sm u-m-0 u-p-md u-text-sm">
      <dt class="u-text-bold">{{ localize("A5E.Uses") }}:</dt>
      <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
        <div v-if="hasUses" class="u-flex u-gap-md">
          <span>
            {{ data.data.uses.value || 0 }}
          </span>

          <span v-if="data.data.uses.max">/</span>
          <span v-if="data.data.uses.max">{{ data.data.uses.max }}</span>

          <span v-if="data.data.uses.per">
            ( Per
            {{ localize(config.resourceRecoveryOptions[data.data.uses.per]) }} )
          </span>
        </div>

        <div v-else>
          {{ localize("A5E.None") }}
        </div>
      </dd>
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

    const hasUses = computed(() => {
      const { uses } = data.value.data;
      return uses.value || uses.max;
    });

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      hasUses,
      item,
      localize: (key) => game.i18n.localize(key),
    };
  },
};
</script>
