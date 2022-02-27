<template>
  <li class="a5e-item a5e-item--skill" @click="onRollSkill(label)">
    <span
      class="a5e-skill__value"
      :class="{ 'a5e-skill__value--green': skill.proficient }"
    >
      {{ skill.deterministicBonus }}
    </span>

    <i
      v-if="!sheetIsLocked"
      class="a5e-config-button a5e-config-button--skill fas fa-cog"
      @click.stop="onClickConfigButton(label)"
    ></i>

    <div class="u-flex u-flex-col u-gap-xxs u-justify-center">
      <header class="u-align-center u-flex u-gap-xs">
        <h3 class="u-text-bold u-text-sm">
          {{ localize(config.skills[label]) }}
        </h3>

        <span v-if="skill.expertiseDice" class="u-text-xs">
          ({{ getExpertiseDieSize(skill.expertiseDice, false) }})
        </span>
      </header>

      <ul
        class="
          u-flex
          u-flex-wrap
          u-font-san-serif
          u-list-style-none
          u-m-0
          u-p-0
          u-text-xxs
          u-gap-xs
        "
      >
        <template v-if="skill.specialties.length">
          <li
            v-for="specialty in skill.specialties.sort((a, b) =>
              a.toLowerCase().localeCompare(b.toLowerCase())
            )"
            :key="specialty"
            class="a5e-tag a5e-tag--tight"
          >
            {{
              localize(config.skillSpecialties[label][specialty] ?? specialty)
            }}
          </li>
        </template>

        <li
          v-else
          class="
            u-border u-border-transparent u-py-xxxs u-text-italic u-text-medium
          "
        >
          {{ localize("A5E.SkillNoSpecialties") }}
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
import getExpertiseDieSize from "../../../../modules/utils/getExpertiseDieSize";

import { inject } from "vue";

export default {
  props: { label: String, skill: Object },
  setup() {
    const actor = inject("actor");
    const sheetIsLocked = inject("sheetIsLocked");

    function onClickConfigButton(skill) {
      actor.configureSkill(skill);
    }

    function onRollSkill(skill) {
      actor.rollSkillCheck(skill);
    }

    return {
      config: CONFIG.A5E,
      getExpertiseDieSize,
      localize: (key) => game.i18n.localize(key),
      onClickConfigButton,
      onRollSkill,
      sheetIsLocked,
    };
  },
};
</script>
