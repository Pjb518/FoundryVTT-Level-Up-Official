<script>
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    const rollModes = CONST.DICE_ROLL_MODES;
    const { DICE_ROLL_MODES } = CONFIG.A5E;

    export let visibilityMode;
</script>

<FormSection heading="Visibility Mode">
    <RadioGroup
        options={Object.entries(rollModes).map(([_, mode]) => [
            mode,
            DICE_ROLL_MODES[mode],
        ])}
        selected={visibilityMode}
        on:updateSelection={({ detail }) => (visibilityMode = detail)}
    />
</FormSection>
