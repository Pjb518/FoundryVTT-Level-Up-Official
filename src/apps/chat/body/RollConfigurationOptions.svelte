<script>
    import { createEventDispatcher } from "svelte";

    import FormSection from "../../components/FormSection.svelte";
    import RadioGroup from "../../components/RadioGroup.svelte";

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

<FormSection heading="Configure Roll Mode">
    <RadioGroup
        options={damageButtons}
        selected={rollData.rollMode ?? 0}
        on:updateSelection={({ detail }) => dispatch("toggleRollMode", detail)}
    />
</FormSection>

<FormSection heading="Configure Expertise Die">
    <RadioGroup
        options={expertiseDice}
        selected={rollData.expertiseDice ?? 0}
        on:updateSelection={({ detail }) =>
            dispatch("toggleExpertiseDice", detail)}
    />
</FormSection>
