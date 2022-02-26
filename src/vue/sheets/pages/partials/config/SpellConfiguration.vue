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
      <h3>Spell Properties</h3>
      <i
        class="u-text-sm fas"
        :class="editModeActive ? 'fa-chevron-up' : 'fa-edit'"
      ></i>
    </header>

    <div v-if="editModeActive" class="u-flex u-flex-col u-gap-md">
      <form-section heading="A5E.SpellLevel">
        <update-wrapper
          :document="item"
          updatePath="data.level"
          v-slot="slotProps"
        >
          <radio-group
            :options="Object.entries(config.spellLevels)"
            :selected="data.data.level"
            :selectionHandler="slotProps.selectionHandler"
          />
        </update-wrapper>
      </form-section>

      <form-section heading="A5E.SpellSchoolPrimary">
        <update-wrapper
          :document="item"
          updatePath="data.schools.primary"
          v-slot="slotProps"
        >
          <radio-group
            :options="Object.entries(config.spellSchools.primary)"
            :selected="data.data.schools.primary"
            :selectionHandler="slotProps.selectionHandler"
          />
        </update-wrapper>
      </form-section>

      <form-section heading="A5E.SpellSchoolSecondaryPlural">
        <update-wrapper
          :document="item"
          updatePath="data.schools.secondary"
          v-slot="slotProps"
        >
          <checkbox-group
            :options="Object.entries(config.spellSchools.secondary)"
            :selected="data.data.schools.secondary"
            :selectionHandler="slotProps.selectionHandler"
          />
        </update-wrapper>
      </form-section>

      <form-section heading="A5E.SpellComponents">
        <ul
          class="
            u-flex
            u-flex-wrap
            u-gap-sm
            u-list-style-none
            u-m-0
            u-p-0
            u-text-xs
            u-w-full
          "
        >
          <option-tag
            v-for="[value, label] in Object.entries(config.spellComponents)"
            :key="value"
            v-bind="{ label, value }"
            :selected="data.data.components[value]"
            @option-selected="onUpdateSpellComponentSelection"
          />
        </ul>
      </form-section>

      <form-section
        v-if="data.data.components.material"
        heading="A5E.SpellMaterials"
      >
        <div class="u-w-full">
          <input
            class="a5e-input"
            name="data.materials"
            type="text"
            :value="data.data.materials"
          />
        </div>
      </form-section>

      <form-section>
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-align-center u-flex u-gap-md">
            <input
              class="u-pointer"
              type="checkbox"
              name="data.concentration"
              :id="`${appId}-concentration`"
              :checked="data.data.concentration"
            />

            <label class="u-pointer" :for="`${appId}-concentration`">
              {{ localize("A5E.SpellConcentration") }}
            </label>
          </div>

          <div class="u-align-center u-flex u-gap-md">
            <input
              class="u-pointer"
              type="checkbox"
              name="data.prepared"
              :id="`${appId}-prepared`"
              :checked="data.data.prepared"
            />

            <label class="u-pointer" :for="`${appId}-prepared`">
              {{ localize("A5E.ItemPrepared") }}
            </label>
          </div>

          <div
            v-if="data.data.level > 0"
            class="u-align-center u-flex u-gap-md"
          >
            <input
              class="u-pointer"
              type="checkbox"
              name="data.ritual"
              :id="`${appId}-ritual`"
              :checked="data.data.ritual"
            />

            <label class="u-pointer" :for="`${appId}-ritual`">
              {{ localize("A5E.SpellRitual") }}
            </label>
          </div>
        </div>
      </form-section>
    </div>

    <dl
      v-else
      class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm"
    >
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.SpellLevel") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ localize(config.spellLevels[data.data.level]) }}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.SpellSchoolPrimary") }}:</dt>
        <dd class="u-m-0 u-p-0">
          {{ localize(config.spellSchools.primary[data.data.schools.primary]) }}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-flex-shrink-0 u-text-bold">
          {{ localize("A5E.SpellSchoolSecondaryPlural") }}:
        </dt>

        <dd class="u-m-0 u-p-0">
          <ul
            class="
              u-comma-list
              u-flex
              u-flex-wrap
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
            "
            v-if="data.data.schools.secondary.length"
          >
            <li v-for="school in data.data.schools.secondary" :key="school">
              {{ localize(config.spellSchools.secondary[school] ?? school) }}
            </li>
          </ul>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>

      <hr class="a5e-rule u-my-sm" />

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{{ localize("A5E.SpellComponents") }}:</dt>
        <dd class="u-flex u-gap-ch u-m-0 u-p-0">
          <ul
            class="
              u-comma-list
              u-flex
              u-flex-shrink-0
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
              u-w-fit
            "
            v-if="Object.values(data.data.components).some(Boolean)"
          >
            <li
              v-for="[component] in Object.entries(data.data.components).filter(
                ([_, state]) => state
              )"
              :key="component"
            >
              {{
                localize(
                  `${config.spellComponents[component]}Abbr` ?? component
                )
              }}
            </li>
          </ul>

          <template v-else>
            {{ localize("A5E.None") }}
          </template>
        </dd>
      </div>

      <div
        v-if="data.data.components.material && data.data.materials"
        class="u-flex u-gap-md"
      >
        <dt class="u-flex-shrink-0 u-text-bold">
          {{ localize("A5E.SpellMaterials") }}:
        </dt>

        <dd class="u-m-0 u-p-0">
          {{ data.data.materials }}
        </dd>
      </div>
    </dl>
  </section>
</template>

<script>
import { inject, ref, watch } from "vue";

import CheckboxGroup from "../../../../forms/CheckboxGroup.vue";
import FormSection from "../../../../forms/FormSection.vue";
import OptionTag from "../../../../forms/OptionTag.vue";
import RadioGroup from "../../../../forms/RadioGroup.vue";
import UpdateWrapper from "../../../../forms/UpdateWrapper.vue";

export default {
  components: {
    CheckboxGroup,
    FormSection,
    OptionTag,
    RadioGroup,
    UpdateWrapper,
  },
  setup() {
    const appId = inject("appId");
    const data = inject("data");
    const item = inject("item");

    const editModeActive = ref(false);

    watch(
      () => data.value.data.level,
      (level) => {
        if (parseInt(level, 10) === 0) {
          item.update({ "data.ritual": false });
        }
      }
    );

    function onUpdateSpellComponentSelection(key) {
      item.update({
        [`data.components.${key}`]: !data.value.data.components[key],
      });
    }

    return {
      appId,
      config: CONFIG.A5E,
      data,
      editModeActive,
      item,
      localize: (key) => game.i18n.localize(key),
      onUpdateSpellComponentSelection,
    };
  },
};
</script>
