<template>
  <section
    class="u-flex u-flex-col u-gap-xl u-h-full u-p-lg u-pb-xl u-overflow-y-auto"
  >
    <section class="u-gap-md u-grid u-grid-3 u-h-fit u-w-full">
      <details-category
        category="senses"
        heading="A5E.SensesSpecial"
        :tags="senses"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="damageResistances"
        heading="A5E.DamageResistances"
        :tags="damageResistances"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="damageImmunities"
        heading="A5E.DamageImmunities"
        :tags="damageImmunities"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="damageVulnerabilities"
        heading="A5E.DamageVulnerabilities"
        :tags="damageVulnerabilities"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="conditionImmunities"
        heading="A5E.ConditionImmunities"
        :tags="conditionImmunities"
        @open-config-window="onClickConfigButton"
      />

      <details-category
        category="languages"
        heading="A5E.Languages"
        :tags="languages"
        @open-config-window="onClickConfigButton"
      />
    </section>

    <div class="u-flex u-gap-lg u-mb-xl u-pb-xl u-w-full">
      <section class="u-w-full">
        <header
          class="
            u-border-b
            u-border-gray
            u-flex
            u-justify-space-between
            u-mb-md
            u-pb-md
            u-px-md
          "
        >
          <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
            {{ localize("A5E.Weapons") }}
          </h3>

          <a
            v-if="!sheetIsLocked"
            class="a5e-button a5e-button--add-item"
            @click="onCreateWeapon"
          >
            + {{ localize("A5E.WeaponAdd") }}
          </a>
        </header>

        <ul
          class="
            u-flex u-flex-col u-gap-xs u-list-style-none u-m-0 u-p-0 u-w-full
            a5e-js-item-list
          "
        >
          <item v-for="weapon in weapons" :key="weapon._id" :item="weapon" />
        </ul>
      </section>

      <section class="u-w-full">
        <header
          class="
            u-border-b
            u-border-gray
            u-flex
            u-justify-space-between
            u-mb-md
            u-pb-md
            u-px-md
          "
        >
          <h3 class="u-border-none u-font-serif u-text-lg u-w-full u-w-fit">
            {{ localize("A5E.TabFeatures") }}
          </h3>

          <a
            v-if="!sheetIsLocked"
            class="a5e-button a5e-button--add-item"
            @click="onCreateFeature"
          >
            + {{ localize("A5E.FeatureAdd") }}
          </a>
        </header>

        <ul
          class="
            u-flex u-flex-col u-gap-xs u-list-style-none u-m-0 u-p-0 u-w-full
            a5e-js-item-list
          "
        >
          <item
            v-for="feature in features"
            :key="feature._id"
            :item="feature"
          />
        </ul>
      </section>
    </div>
  </section>

  <tab-footer>
    <div class="u-align-center u-flex u-gap-md u-ml-auto u-text-md">
      <h3 class="u-mb-0">
        {{ localize("A5E.XP") }}
      </h3>

      <span class="a5e-footer-group__value">{{ xp }}</span>
    </div>
  </tab-footer>
</template>

<script>
import { computed, inject, onMounted } from "vue";

import applyFeatureFilters from "../../utils/filterHelpers/applyFeatureFilters";
import applyObjectFilters from "../../utils/filterHelpers/applyObjectFilters";
import prepareChallengeRating from "../../utils/dataPreparationHelpers/prepareChallengeRating";
import prepareConditionImmunities from "../../utils/dataPreparationHelpers/prepareConditionImmunities";
import prepareDamageImmunities from "../../utils/dataPreparationHelpers/prepareDamageImmunities";
import prepareDamageResistances from "../../utils/dataPreparationHelpers/prepareDamageResistances";
import prepareDamageVulnerabilities from "../../utils/dataPreparationHelpers/prepareDamageVulnerabilities";
import prepareLanguageProficiencies from "../../utils/dataPreparationHelpers/prepareLanguageProficiencies";
import prepareSenses from "../../utils/dataPreparationHelpers/prepareSenses";

import DetailsCategory from "./partials/DetailsCategory.vue";
import Item from "./partials/Item.vue";
import TabFooter from "./partials/TabFooter.vue";

export default {
  components: { DetailsCategory, Item, TabFooter },
  setup() {
    const actor = inject("actor");
    const data = inject("data");
    const sheet = inject("sheet");
    const sheetIsLocked = inject("sheetIsLocked");

    const handlers = {
      conditionImmunities: actor.configureConditionImmunities.bind(actor),
      damageImmunities: actor.configureDamageImmunities.bind(actor),
      damageResistances: actor.configureDamageResistances.bind(actor),
      damageVulnerabilities: actor.configureDamageVulnerabilities.bind(actor),
      languages: actor.configureLanguages.bind(actor),
      senses: actor.configureSenses.bind(actor),
    };

    const conditionImmunities = computed(() =>
      prepareConditionImmunities(data.value)
    );

    const damageImmunities = computed(() =>
      prepareDamageImmunities(data.value)
    );

    const damageResistances = computed(() =>
      prepareDamageResistances(data.value)
    );

    const damageVulnerabilities = computed(() =>
      prepareDamageVulnerabilities(data.value)
    );

    const languages = computed(() => prepareLanguageProficiencies(data.value));
    const senses = computed(() => prepareSenses(data.value));

    const features = computed(() =>
      applyFeatureFilters(
        actor,
        data.value.items.filter(
          (x) => x.type === "feature" && x.data.featureType !== "naturalWeapon"
        )
      ).sort((a, b) => a.sort - b.sort)
    );

    const weapons = computed(() =>
      applyObjectFilters(
        actor,
        data.value.items.filter(
          (x) =>
            (x.type === "object" && x.data.objectType === "weapon") ||
            (x.type === "feature" && x.data.featureType === "naturalWeapon")
        )
      ).sort((a, b) => a.sort - b.sort)
    );

    const xp = computed(() => {
      const cr = prepareChallengeRating(data);
      const baseXp = CONFIG.A5E.CR_EXP_LEVELS[parseInt(cr) > 30 ? "30" : cr];

      return data.value.data.details.elite ? baseXp * 2 : baseXp;
    });

    onMounted(() => {
      sheet.activateVueListeners($(sheet.form));
    });

    function onClickConfigButton(category) {
      const handler = handlers[category];
      handler();
    }

    async function onCreateFeature() {
      const newItems = await actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("A5E.ItemNew"),
          type: "feature",
        },
      ]);

      newItems[0].sheet.render(true);
    }

    async function onCreateWeapon() {
      const newItems = await actor.createEmbeddedDocuments("Item", [
        {
          name: game.i18n.localize("A5E.ItemNew"),
          type: "object",
          "data.objectType": "weapon",
        },
      ]);

      newItems[0].sheet.render(true);
    }

    return {
      actor,
      conditionImmunities,
      config: CONFIG.A5E,
      data,
      damageImmunities,
      damageResistances,
      damageVulnerabilities,
      features,
      languages,
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
      onCreateFeature,
      onCreateWeapon,
      senses,
      sheet,
      sheetIsLocked,
      weapons,
      xp,
    };
  },
};
</script>
