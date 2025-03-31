<script>
    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";

    import RadioGroup from "./RadioGroup.svelte";

    export let type = "character";
    export let selected;
    export let source = "";

    const options = prepareExpertiseDiceOptions(type);
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

    $: buttons = source.length
        ? [{ classes: "icon fas fa-question-circle", tooltip: source }]
        : [];
</script>

{#if !hideExpertiseDice}
    <RadioGroup
        heading="A5E.ExpertiseDie"
        {buttons}
        {options}
        {selected}
        allowDeselect={false}
        optionStyles="min-width: 1.75rem; text-align: center;"
        on:updateSelection
    />
{/if}
