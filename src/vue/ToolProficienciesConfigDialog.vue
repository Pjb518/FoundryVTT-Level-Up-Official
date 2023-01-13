<template>
  <form
    class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none"
    @submit.prevent="onSubmit"
  >
    <tag-group
      heading="A5E.ToolsArtisanTools"
      :initial-selections="artisansToolProficiencies"
      :tags="artisansTools"
      @update-selection-list="updateArtisansToolProficiencies"
    />

    <tag-group
      heading="A5E.ToolsGamingSets"
      :initial-selections="gamingSetProficiencies"
      :tags="gamingSets"
      @update-selection-list="updateGamingSetProficiencies"
    />

    <tag-group
      heading="A5E.MusicalInstruments"
      :initial-selections="musicalInstrumentProficiencies"
      :tags="musicalInstruments"
      @update-selection-list="updateMusicalInstrumentProficiencies"
    />

    <tag-group
      heading="A5E.ToolsMiscellaneous"
      :initial-selections="miscellaneousToolProficiencies"
      :tags="miscellaneous"
      @update-selection-list="updateMiscellaneousToolProficiencies"
    />

    <tag-group
      heading="A5E.ToolsVehicles"
      :initial-selections="vehicleProficiencies"
      :tags="vehicles"
      @update-selection-list="updateVehicleProficiencies"
    />

    <input-field
      heading="A5E.ToolsOther"
      hint="A5E.HintSeparateBySemiColon"
      :has-initial-focus="true"
      :initial-value="otherToolProficiencies"
      @update-field-value="updateOtherToolProficiencies"
    />

    <button class="a5e-button" type="submit">
      <i class="fas fa-save" /> {{ submitText }}
    </button>
  </form>
</template>

<script>
import { ref } from 'vue';
import InputField from './partials/InputField.vue';
import TagGroup from './partials/TagGroup.vue';

export default {
  components: { InputField, TagGroup },
  setup(_, context) {
    const { actor, appWindow } = context.attrs;
    const actorData = actor.system;

    const { artisansTools } = CONFIG.A5E.toolsPlural;
    const { gamingSets } = CONFIG.A5E.toolsPlural;
    const { musicalInstruments } = CONFIG.A5E.toolsPlural;
    const { miscellaneous } = CONFIG.A5E.toolsPlural;
    const { vehicles } = CONFIG.A5E.toolsPlural;

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
        other: []
      }
    );

    const artisansToolProficiencies = ref(toolProficiencies.artisansTools);
    const gamingSetProficiencies = ref(toolProficiencies.gamingSets);

    const musicalInstrumentProficiencies = ref(
      toolProficiencies.musicalInstruments
    );

    const miscellaneousToolProficiencies = ref(toolProficiencies.miscellaneous);
    const vehicleProficiencies = ref(toolProficiencies.vehicles);
    const otherToolProficiencies = ref(toolProficiencies.other.join('; '));

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
      const updatedToolProficiencies = [
        ...artisansToolProficiencies.value,
        ...gamingSetProficiencies.value,
        ...musicalInstrumentProficiencies.value,
        ...miscellaneousToolProficiencies.value,
        ...vehicleProficiencies.value,
        ...otherToolProficiencies.value
          .split(';')
          .map((tool) => tool.trim())
          .filter(Boolean)
      ];

      actor.update({ 'data.proficiencies.tools': updatedToolProficiencies });
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
      submitText: game.i18n.localize('A5E.SaveSubmit')
    };
  }
};
</script>
