<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import InputField from "../components/InputField.svelte";
    import Section from "../components/Section.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { application } = getContext("#external");
    export let { document, appId, max, submitDialog, dialogTools, dialogHint } =
        getContext("#external").application;

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

        if (submitDialog) {
            dialogTools = proficiencies.slice(0, max);
            return;
        }

        updateDocumentDataFromField(
            $actor,
            "system.proficiencies.tools",
            proficiencies,
        );
    }

    function submitForm() {
        application.submit({
            tools,
        });
    }

    const actor = document;
    const { A5E } = CONFIG;

    const {
        artisansTools,
        gamingSets,
        musicalInstruments,
        miscellaneous,
        vehicles,
    } = A5E.toolsPlural;

    $: tools = submitDialog ? dialogTools : $actor.system.proficiencies.tools;

    $: toolProficiencies = tools.reduce(
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
        },
    );

    $: otherProficiencies = toolProficiencies.other.join("; ");
</script>

<Section
    hint={dialogHint}
    --a5e-section-body-gap="0.75rem"
    --a5e-section-padding="0.75rem"
    --a5e-section-margin="0"
>
    <CheckboxGroup
        heading="A5E.ToolsArtisanTools"
        options={Object.entries(artisansTools)}
        selected={toolProficiencies.artisansTools}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            toolProficiencies.artisansTools = detail;
            updateFunction();
        }}
    />

    <CheckboxGroup
        heading="A5E.ToolsGamingSets"
        options={Object.entries(gamingSets)}
        selected={toolProficiencies.gamingSets}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            toolProficiencies.gamingSets = detail;
            updateFunction();
        }}
    />

    <CheckboxGroup
        heading="A5E.MusicalInstruments"
        options={Object.entries(musicalInstruments)}
        selected={toolProficiencies.musicalInstruments}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            toolProficiencies.musicalInstruments = detail;
            updateFunction();
        }}
    />

    <CheckboxGroup
        heading="A5E.ToolsMiscellaneous"
        options={Object.entries(miscellaneous)}
        selected={toolProficiencies.miscellaneous}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            toolProficiencies.miscellaneous = detail;
            updateFunction();
        }}
    />

    <CheckboxGroup
        heading="A5E.ToolsVehicles"
        options={Object.entries(vehicles)}
        selected={toolProficiencies.vehicles}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        showToggleAllButton={true}
        on:updateSelection={({ detail }) => {
            toolProficiencies.vehicles = detail;
            updateFunction();
        }}
    />

    <InputField
        heading="A5E.ToolsOther"
        hint="A5E.HintSeparateBySemiColon"
        bind:fieldValue={otherProficiencies}
        {updateFunction}
    />

    {#if submitDialog}
        <div class="u-flex">
            <button on:click|preventDefault={submitForm}>
                {localize("A5E.Submit")}
            </button>
        </div>
    {/if}
</Section>
