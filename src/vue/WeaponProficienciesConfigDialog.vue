<template>
  <form
    @submit.prevent="onSubmit"
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog"
  >
    <tag-group
      heading="A5E.WeaponsSimple"
      :initialSelections="simpleWeaponProficiencies"
      :tags="simpleWeapons"
      @updateSelectionList="updateSimpleWeaponProficiencies"
    />

    <tag-group
      heading="A5E.WeaponsMartial"
      :initialSelections="martialWeaponProficiencies"
      :tags="martialWeapons"
      @updateSelectionList="updateMartialWeaponProficiencies"
    />

    <tag-group
      heading="A5E.WeaponsRare"
      :initialSelections="rareWeaponProficiencies"
      :tags="rareWeapons"
      @updateSelectionList="updateRareWeaponProficiencies"
    />

    <input-field
      heading="A5E.WeaponsOther"
      :hasInitialFocus="true"
      hint="A5E.HintSeparateBySemiColon"
      :initialValue="otherWeaponProficiencies"
      @update-field-value="updateOtherWeaponProficiencies"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save"></i> {{ submitText }}
    </button>
  </form>
</template>

<script>
import InputField from "./partials/InputField.vue";
import TagGroup from "./partials/TagGroup.vue";

import { ref } from "vue";

export default {
  components: { InputField, TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.data.data;

    const martialWeapons = CONFIG.A5E.weaponsPlural.martial;
    const rareWeapons = CONFIG.A5E.weaponsPlural.rare;
    const simpleWeapons = CONFIG.A5E.weaponsPlural.simple;

    const weaponProficiencies = actorData.proficiencies.weapons.reduce(
      (acc, curr) => {
        if (Object.keys(martialWeapons).includes(curr)) {
          acc.martial.push(curr);
        } else if (Object.keys(simpleWeapons).includes(curr)) {
          acc.simple.push(curr);
        } else if (Object.keys(rareWeapons).includes(curr)) {
          acc.rare.push(curr);
        } else {
          acc.other.push(curr);
        }

        return acc;
      },
      {
        simple: [],
        martial: [],
        rare: [],
        other: [],
      }
    );

    const martialWeaponProficiencies = ref(weaponProficiencies.martial);
    const rareWeaponProficiencies = ref(weaponProficiencies.rare);
    const simpleWeaponProficiencies = ref(weaponProficiencies.simple);
    const otherWeaponProficiencies = ref(weaponProficiencies.other.join("; "));

    function updateMartialWeaponProficiencies(value) {
      martialWeaponProficiencies.value = value;
    }

    function updateRareWeaponProficiencies(value) {
      rareWeaponProficiencies.value = value;
    }

    function updateSimpleWeaponProficiencies(value) {
      simpleWeaponProficiencies.value = value;
    }

    function updateOtherWeaponProficiencies(value) {
      otherWeaponProficiencies.value = value;
    }

    function onSubmit() {
      const weaponProficiencies = [
        ...martialWeaponProficiencies.value,
        ...simpleWeaponProficiencies.value,
        ...rareWeaponProficiencies.value,
        ...otherWeaponProficiencies.value
          .split(";")
          .map((weapon) => weapon.trim())
          .filter(Boolean),
      ];

      actor.update({ "data.proficiencies.weapons": weaponProficiencies });
      appWindow.submit();
    }

    return {
      martialWeapons,
      martialWeaponProficiencies,
      rareWeapons,
      rareWeaponProficiencies,
      simpleWeapons,
      simpleWeaponProficiencies,
      otherWeaponProficiencies,
      onSubmit,
      updateMartialWeaponProficiencies,
      updateRareWeaponProficiencies,
      updateSimpleWeaponProficiencies,
      updateOtherWeaponProficiencies,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
