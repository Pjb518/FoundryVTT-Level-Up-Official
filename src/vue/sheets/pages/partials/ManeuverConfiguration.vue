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
      <h3>Maneuver Properties</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.ManeuverDegreePrompt">
        <radio-group
          :document="item"
          :options="Object.entries(config.maneuverDegrees)"
          updatePath="data.degree"
        />
      </form-section>

      <template v-if="data.data.degree > 0">
        <form-section heading="A5E.ManeuverTraditionPrompt">
          <radio-group
            :document="item"
            :options="Object.entries(config.maneuverTraditions)"
            updatePath="data.tradition"
          />
        </form-section>

        <form-section>
          <div
            class="
              u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full
            "
          >
            <label class="u-text-bold u-w-full" :for="`${appId}-exertion-cost`">
              {{ localize("A5E.ItemExertionCost") }}
            </label>

            <div class="u-w-20">
              <input
                type="number"
                data-dtype="Number"
                name="data.exertionCost"
                :value="data.data.exertionCost"
                :id="`${appId}-exertion-cost`"
              />
            </div>
          </div>
        </form-section>
      </template>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ManeuverDegreePrompt") }}:</dt>

        <dd class="u-m-0 u-p-0">
          {{ localize(config.maneuverDegrees[data.data.degree]) }}
        </dd>
      </div>

      <template v-if="data.data.degree > 0">
        <div class="u-flex u-gap-md">
          <dt class="u-text-bold">
            {{ localize("A5E.ManeuverTraditionPrompt") }}:
          </dt>

          <dd class="u-m-0 u-p-0">
            {{
              localize(
                config.maneuverTraditions[data.data.tradition] ?? "A5E.None"
              )
            }}
          </dd>
        </div>

        <div class="u-flex u-gap-md">
          <dt class="u-text-bold">{{ localize("A5E.ItemExertionCost") }}:</dt>
          <dd class="u-m-0 u-p-0">{{ data.data.exertionCost || 0 }}</dd>
        </div>
      </template>
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
