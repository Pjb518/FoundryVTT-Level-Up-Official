<script lang="ts">
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        rollData: any;
        onToggleRollMode: (value) => void;
        onToggleExpertiseDice: (value) => void;
    };

    let { rollData, onToggleRollMode, onToggleExpertiseDice }: Props = $props();

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
</script>

<Section --a5e-section-body-gap="0.75rem" --a5e-section-margin="0.5rem 0">
    <RadioGroup
        heading="Configure Roll Mode"
        options={damageButtons}
        selected={rollData.rollMode ?? 0}
        onUpdateSelection={(detail) => onToggleRollMode(detail)}
    />

    <RadioGroup
        heading="Configure Expertise Die"
        options={expertiseDice}
        selected={rollData.expertiseDice ?? 0}
        onUpdateSelection={(detail) => onToggleExpertiseDice(detail)}
    />
</Section>
