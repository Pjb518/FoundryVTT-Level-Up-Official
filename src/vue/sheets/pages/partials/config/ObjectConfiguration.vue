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
      <h3>Object Properties</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.ObjectTypePrompt">
        <radio-group
          :document="item"
          :options="Object.entries(config.objectTypes)"
          updatePath="data.objectType"
        />
      </form-section>

      <form-section heading="A5E.ItemRarity">
        <radio-group
          :document="item"
          :options="Object.entries(config.itemRarity)"
          updatePath="data.rarity"
        />
      </form-section>

      <form-section>
        <div class="u-flex u-gap-xxxl u-text-sm u-w-full">
          <div class="u-align-center u-flex u-gap-md">
            <input
              class="u-pointer"
              type="checkbox"
              name="data.requiresAttunement"
              :id="`${appId}-attunement-required`"
              :checked="data.data.requiresAttunement"
            />

            <label class="u-pointer" :for="`${appId}-attunement-required`">
              {{ localize("A5E.AttunementRequiredPrompt") }}
            </label>
          </div>

          <div
            v-if="data.data.requiresAttunement"
            class="u-align-center u-flex u-gap-md"
          >
            <input
              class="u-pointer"
              type="checkbox"
              name="data.attuned"
              :id="`${appId}-attuned`"
              :checked="data.data.attuned"
            />

            <label class="u-pointer" :for="`${appId}-attuned`">
              {{ localize("A5E.AttunementPrompt") }}
            </label>
          </div>

          <div class="u-align-center u-flex u-gap-md">
            <input
              class="u-pointer"
              type="checkbox"
              name="data.plotItem"
              :id="`${appId}-plot-item`"
              :checked="data.data.plotItem"
            />

            <label class="u-pointer" :for="`${appId}-plot-item`">
              {{ localize("A5E.PlotItem") }}
            </label>
          </div>
        </div>
      </form-section>

      <form-section heading="A5E.ItemWeight">
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="align-center u-flex u-gap-xxl">
            <div class="u-w-30">
              <input
                type="text"
                name="data.weight"
                :id="`${appId}-weight`"
                :value="data.data.weight"
              />
            </div>

            <div class="u-align-center u-flex u-gap-md">
              <input
                class="u-pointer"
                type="checkbox"
                name="data.bulky"
                :id="`${appId}-bulky`"
                :checked="data.data.bulky"
              />

              <label class="u-pointer" :for="`${appId}-bulky`">
                {{ localize("A5E.ItemBulky") }}
              </label>
            </div>

            <div class="u-align-center u-flex u-gap-md">
              <input
                class="u-pointer"
                type="checkbox"
                name="data.equipped"
                :id="`${appId}-equipped`"
                :checked="data.data.equipped"
              />

              <label class="u-pointer" :for="`${appId}-equipped`">
                {{ localize("A5E.ItemEquipped") }}
              </label>
            </div>
          </div>
        </div>
      </form-section>

      <form-section heading="A5E.ItemQuantity">
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-w-20">
            <input
              type="number"
              data-dtype="Number"
              name="data.quantity"
              :id="`${appId}-quantity`"
              :value="data.data.quantity"
            />
          </div>
        </div>
      </form-section>

      <form-section heading="A5E.ItemPrice">
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-w-30">
            <input
              class="u-pl-lg"
              type="text"
              data-dtype="String"
              name="data.price"
              :id="`${appId}-price`"
              :value="data.data.price"
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
        <dt class="u-text-bold">{{ localize("A5E.ObjectTypePrompt") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{
            localize(
              config.objectTypes[data.data.objectType] ?? data.data.objectType
            )
          }}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemRarity") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{
            localize(config.itemRarity[data.data.rarity] ?? data.data.rarity)
          }}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.Attunement") }}:</dt>
        <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
          <template v-if="data.data.requiresAttunement">
            {{ localize("A5E.AttunementRequired") }}

            ({{
              localize(data.data.attuned ? "A5E.Attuned" : "A5E.AttunedNot")
            }})
          </template>

          <template v-else>
            {{ localize("A5E.AttunementNotRequired") }}
          </template>
        </dd>
      </div>

      <hr class="a5e-rule u-my-sm" />

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemWeight") }}:</dt>
        <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
          {{ data.data.weight }}

          <template v-if="data.data.bulky">
            ({{ localize("A5E.ItemBulky") }})
          </template>
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemQuantity") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ data.data.quantity || 0 }}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.ItemPrice") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ data.data.price || 0 }}
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
import { inject, ref } from "vue";

import FormSection from "../../../../forms/FormSection.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";

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
