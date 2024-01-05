<script>
    import { createEventDispatcher } from "svelte";

    import RadioGroup from "../../components/RadioGroup.svelte";
    import Section from "../../components/Section.svelte";

    export let rollData = {};

    const damageButtons = [
        [1, "Advantage"],
        [0, "Normal"],
        [-1, "Disadvantage"],
    ];

    const expertiseDice = [
        [0, "None"],
        [1, "1d4"],
        [2, "1d6"],
        [3, "1d8"],
        [4, "1d10"],
        [5, "1d12"],
    ];

    const dispatch = createEventDispatcher();
</script>

<Section --a5e-section-body-gap="0.75rem" --a5e-section-margin="0">
    <RadioGroup
        heading="Configure Roll Mode"
        options={damageButtons}
        selected={rollData.rollMode ?? 0}
        on:updateSelection={({ detail }) => dispatch("toggleRollMode", detail)}
    />

    <RadioGroup
        heading="Configure Expertise Die"
        options={expertiseDice}
        selected={rollData.expertiseDice ?? 0}
        on:updateSelection={({ detail }) =>
            dispatch("toggleExpertiseDice", detail)}
    />
</Section>
