<script>
    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";

    import FormSection from "./FormSection.svelte";
    import RadioGroup from "./RadioGroup.svelte";

    export let selected;

    const options = prepareExpertiseDiceOptions();
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");
</script>

{#if !hideExpertiseDice}
    <FormSection heading="A5E.ExpertiseDie">
        <RadioGroup
            {options}
            {selected}
            allowDeselect={false}
            optionStyles="min-width: 1.75rem; text-align: center;"
            on:updateSelection
        />
    </FormSection>
{/if}
