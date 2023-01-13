<template>
  <form
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none"
    @submit.prevent="onSubmit"
  >
    <tag-group
      heading="A5E.WeaponsSimple"
      :initial-selections="simpleWeaponProficiencies"
      :tags="simpleWeapons"
      @update-selection-list="updateSimpleWeaponProficiencies"
    />

    <tag-group
      heading="A5E.WeaponsMartial"
      :initial-selections="martialWeaponProficiencies"
      :tags="martialWeapons"
      @update-selection-list="updateMartialWeaponProficiencies"
    />

    <tag-group
      heading="A5E.WeaponsRare"
      :initial-selections="rareWeaponProficiencies"
      :tags="rareWeapons"
      @update-selection-list="updateRareWeaponProficiencies"
    />

    <input-field
      heading="A5E.WeaponsOther"
      :has-initial-focus="true"
      hint="A5E.HintSeparateBySemiColon"
      :initial-value="otherWeaponProficiencies"
      @update-field-value="updateOtherWeaponProficiencies"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save" /> {{ submitText }}
    </button>
  </form>
</template>

<script>
import { ref } from "vue";
import InputField from "./partials/InputField.vue";
import TagGroup from "./partials/TagGroup.vue";

export default {
  components: { InputField, TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.system;

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
        other: []
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
      const updatedWeaponProficiencies = [
        ...martialWeaponProficiencies.value,
        ...simpleWeaponProficiencies.value,
        ...rareWeaponProficiencies.value,
        ...otherWeaponProficiencies.value
          .split(";")
          .map((weapon) => weapon.trim())
          .filter(Boolean)
      ];

      actor.update({
        "data.proficiencies.weapons": updatedWeaponProficiencies
      });
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
      submitText: game.i18n.localize("A5E.SaveSubmit")
    };
  }
};
</script>
