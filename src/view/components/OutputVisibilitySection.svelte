<script lang="ts">
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        visibilityMode: string;
    };

    let { visibilityMode = $bindable() }: Props = $props();

    const rollModes = CONST.DICE_ROLL_MODES;
    const { DICE_ROLL_MODES } = CONFIG.A5E;
</script>

<RadioGroup
    heading="Visibility Mode"
    options={Object.entries(rollModes).map(([_, mode]) => [
        mode,
        DICE_ROLL_MODES[mode],
    ])}
    selected={visibilityMode}
    onUpdateSelection={(value) => (visibilityMode = value)}
/>
