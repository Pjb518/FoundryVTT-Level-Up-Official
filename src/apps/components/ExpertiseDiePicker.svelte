<script>
    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";

    import RadioGroup from "./RadioGroup.svelte";

    export let selected;

    const options = prepareExpertiseDiceOptions();
</script>

<RadioGroup
    {options}
    {selected}
    allowDeselect={false}
    optionStyles="min-width: 1.75rem; text-align: center;"
    on:updateSelection
/>
