<template>
  <section class="a5e-form__section u-flex u-flex-col u-gap-md">
    <h3 class="u-text-bold u-text-sm">{{ heading }}</h3>

    <div
      class="
        u-flex
        u-flex-wrap
        u-font-san-serif
        u-gap-md
        u-list-style-none
        u-m-0
        u-p-0
        u-text-xs
      "
    >
      <template v-for="skill in skills" :key="skill.name">
        <input
          class="u-hidden"
          type="radio"
          name="skill"
          :value="skill.name"
          :id="appId + '-skill-' + skill.name"
          v-model="selectedSkill"
        />

        <label
          class="a5e-tag u-pointer"
          :class="{ 'a5e-tag--inactive': skill.name !== selectedSkill }"
          :for="appId + '-skill-' + skill.name"
        >
          {{ skill.localized }}
        </label>
      </template>
    </div>
  </section>
</template>

<script>
import { ref, watch } from "vue";
import A5E from "../../modules/config";

export default {
  props: { appId: String },
  setup(_, context) {
    const heading = game.i18n.localize("A5E.Skill");

    const skills = [
      { name: "none", localized: game.i18n.localize("A5E.None") },
      ...Object.entries(A5E.skills).map(([name, i18nKey]) => ({
        name,
        localized: game.i18n.localize(i18nKey),
      })),
    ];

    const selectedSkill = ref("none");

    watch(selectedSkill, (curr) => {
      context.emit("update-selected-skill", curr === "none" ? null : curr);
    });

    return {
      heading,
      selectedSkill,
      skills,
    };
  },
};
</script>
