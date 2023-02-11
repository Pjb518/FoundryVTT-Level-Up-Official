<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import TagGroup from "../components/TagGroup.svelte";
    import InputField from "../components/InputField.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actorDocument, appId } = getContext("#external").application;

    function updateFunction() {
        const proficiencies = [
            ...toolProficiencies.artisansTools,
            ...toolProficiencies.gamingSets,
            ...toolProficiencies.musicalInstruments,
            ...toolProficiencies.miscellaneous,
            ...toolProficiencies.vehicles,
            ...otherProficiencies
                .split(";")
                .map((tool) => tool.trim())
                .filter(Boolean),
        ];

        updateDocumentDataFromField(
            $actor,
            "system.proficiencies.tools",
            proficiencies
        );
    }

    const actor = new TJSDocument(actorDocument);
    const artisansTools = CONFIG.A5E.toolsPlural.artisansTools;
    const gamingSets = CONFIG.A5E.toolsPlural.gamingSets;
    const musicalInstruments = CONFIG.A5E.toolsPlural.musicalInstruments;
    const miscellaneous = CONFIG.A5E.toolsPlural.miscellaneous;
    const vehicles = CONFIG.A5E.toolsPlural.vehicles;

    $: toolProficiencies = $actor.system.proficiencies.tools.reduce(
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

    $: otherProficiencies = toolProficiencies.other.join("; ");
</script>

<form class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none">
    <TagGroup
        heading="A5E.ToolsArtisanTools"
        tags={artisansTools}
        bind:selected={toolProficiencies.artisansTools}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.ToolsGamingSets"
        tags={gamingSets}
        bind:selected={toolProficiencies.gamingSets}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.MusicalInstruments"
        tags={musicalInstruments}
        bind:selected={toolProficiencies.musicalInstruments}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.ToolsMiscellaneous"
        tags={miscellaneous}
        bind:selected={toolProficiencies.miscellaneous}
        {updateFunction}
    />

    <TagGroup
        heading="A5E.ToolsVehicles"
        tags={vehicles}
        bind:selected={toolProficiencies.vehicles}
        {updateFunction}
    />

    <InputField
        heading="A5E.ToolsOther"
        hint="A5E.HintSeparateBySemiColon"
        bind:fieldValue={otherProficiencies}
        {updateFunction}
    />
</form>
