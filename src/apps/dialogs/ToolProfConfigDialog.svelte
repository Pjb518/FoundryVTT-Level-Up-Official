<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import TagGroup from "../components/TagGroup.svelte";
    import InputField from "../components/InputField.svelte";

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

<form class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none">
    {#if dialogHint}
        <div class="u-mb-md u-text-sm" style="color: $color-warning;">
            <i class="fa-solid fa-circle-exclamation" />
            {localize(dialogHint)}
        </div>
    {/if}

    <TagGroup
        heading="A5E.ToolsArtisanTools"
        options={Object.entries(artisansTools)}
        bind:selected={toolProficiencies.artisansTools}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        on:updateSelection={() => updateFunction()}
    />

    <TagGroup
        heading="A5E.ToolsGamingSets"
        options={Object.entries(gamingSets)}
        bind:selected={toolProficiencies.gamingSets}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        on:updateSelection={() => updateFunction()}
    />

    <TagGroup
        heading="A5E.MusicalInstruments"
        options={Object.entries(musicalInstruments)}
        bind:selected={toolProficiencies.musicalInstruments}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        on:updateSelection={() => updateFunction()}
    />

    <TagGroup
        heading="A5E.ToolsMiscellaneous"
        options={Object.entries(miscellaneous)}
        bind:selected={toolProficiencies.miscellaneous}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        on:updateSelection={() => updateFunction()}
    />

    <TagGroup
        heading="A5E.ToolsVehicles"
        options={Object.entries(vehicles)}
        bind:selected={toolProficiencies.vehicles}
        disabled={tools.length >= max}
        disabledOptions={submitDialog ? $actor.system.proficiencies.tools : []}
        red={submitDialog ? $actor.system.proficiencies.tools : []}
        on:updateSelection={() => updateFunction()}
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
</form>
