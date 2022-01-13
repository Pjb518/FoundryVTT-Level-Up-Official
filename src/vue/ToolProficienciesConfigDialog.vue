<template>
  <form @submit.prevent="onSubmit" class="a5e-form a5e-form--reactive-dialog">
    <tag-group
      heading="A5E.ToolsArtisanTools"
      :initialSelections="artisansToolProficiencies"
      :tags="artisansTools"
      @updateSelectionList="updateArtisansToolProficiencies"
    />

    <tag-group
      heading="A5E.ToolsGamingSets"
      :initialSelections="gamingSetProficiencies"
      :tags="gamingSets"
      @updateSelectionList="updateGamingSetProficiencies"
    />

    <tag-group
      heading="A5E.MusicalInstruments"
      :initialSelections="musicalInstrumentProficiencies"
      :tags="musicalInstruments"
      @updateSelectionList="updateMusicalInstrumentProficiencies"
    />

    <tag-group
      heading="A5E.ToolsMiscellaneous"
      :initialSelections="miscellaneousToolProficiencies"
      :tags="miscellaneous"
      @updateSelectionList="updateMiscellaneousToolProficiencies"
    />

    <tag-group
      heading="A5E.ToolsVehicles"
      :initialSelections="vehicleProficiencies"
      :tags="vehicles"
      @updateSelectionList="updateVehicleProficiencies"
    />

    <input-field
      heading="A5E.ToolsOther"
      hint="A5E.HintSeparateBySemiColon"
      :hasInitialFocus="true"
      :initialValue="otherToolProficiencies"
      @update-field-value="updateOtherToolProficiencies"
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

    const artisansTools = CONFIG.A5E.toolsPlural.artisansTools;
    const gamingSets = CONFIG.A5E.toolsPlural.gamingSets;
    const musicalInstruments = CONFIG.A5E.toolsPlural.musicalInstruments;
    const miscellaneous = CONFIG.A5E.toolsPlural.miscellaneous;
    const vehicles = CONFIG.A5E.toolsPlural.vehicles;

    const toolProficiencies = actorData.proficiencies.tools.reduce(
      (acc, curr) => {
        if (Object.keys(artisansTools).includes(curr)) {
          acc.artisansTools.push(curr);
        } else if (Object.keys(gamingSets).includes(curr)) {
          acc.gamingSets.push(curr);
        } else if (Object.keys(musicalInstruments).includes(curr)) {
          acc.musicalInstruments.push(curr);
        } else if (Object.keys(miscellaneous).includes(curr)) {
          acc.miscellaneous.push(curr);
        } else if (Object.keys(vehicles).includes(curr)) {
          acc.vehicles.push(curr);
        } else {
          acc.other.push(curr);
        }

        return acc;
      },
      {
        artisansTools: [],
        gamingSets: [],
        musicalInstruments: [],
        miscellaneous: [],
        vehicles: [],
        other: [],
      }
    );

    const artisansToolProficiencies = ref(toolProficiencies.artisansTools);
    const gamingSetProficiencies = ref(toolProficiencies.gamingSets);

    const musicalInstrumentProficiencies = ref(
      toolProficiencies.musicalInstruments
    );

    const miscellaneousToolProficiencies = ref(toolProficiencies.miscellaneous);
    const vehicleProficiencies = ref(toolProficiencies.vehicles);
    const otherToolProficiencies = ref(toolProficiencies.other.join("; "));

    function updateArtisansToolProficiencies(value) {
      artisansToolProficiencies.value = value;
    }

    function updateGamingSetProficiencies(value) {
      gamingSetProficiencies.value = value;
    }

    function updateMusicalInstrumentProficiencies(value) {
      musicalInstrumentProficiencies.value = value;
    }

    function updateMiscellaneousToolProficiencies(value) {
      miscellaneousToolProficiencies.value = value;
    }

    function updateVehicleProficiencies(value) {
      vehicleProficiencies.value = value;
    }

    function updateOtherToolProficiencies(value) {
      otherToolProficiencies.value = value;
    }

    function onSubmit() {
      const toolProficiencies = [
        ...artisansToolProficiencies.value,
        ...gamingSetProficiencies.value,
        ...musicalInstrumentProficiencies.value,
        ...miscellaneousToolProficiencies.value,
        ...vehicleProficiencies.value,
        ...otherToolProficiencies.value
          .split(";")
          .map((tool) => tool.trim())
          .filter(Boolean),
      ];

      actor.update({ "data.proficiencies.tools": toolProficiencies });
      appWindow.submit();
    }

    return {
      artisansTools,
      artisansToolProficiencies,
      gamingSets,
      gamingSetProficiencies,
      musicalInstruments,
      musicalInstrumentProficiencies,
      miscellaneous,
      miscellaneousToolProficiencies,
      vehicles,
      vehicleProficiencies,
      onSubmit,
      otherToolProficiencies,
      updateArtisansToolProficiencies,
      updateGamingSetProficiencies,
      updateMusicalInstrumentProficiencies,
      updateMiscellaneousToolProficiencies,
      updateVehicleProficiencies,
      updateOtherToolProficiencies,
      submitText: game.i18n.localize("A5E.SaveSubmit"),
    };
  },
};
</script>
