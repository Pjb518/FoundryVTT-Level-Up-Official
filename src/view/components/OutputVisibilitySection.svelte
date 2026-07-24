<script lang="ts">
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        visibilityMode: string;
    };

    let { visibilityMode = $bindable() }: Props = $props();

    const rollModes = CONFIG.ChatMessage.modes;
    const { DICE_ROLL_MODES } = CONFIG.A5E;
</script>

<RadioGroup
    heading="Visibility Mode"
    options={Object.entries(rollModes).map(([mode, _]) => [
        mode,
        DICE_ROLL_MODES[mode],
    ])}
    selected={visibilityMode}
    onUpdateSelection={(value) => (visibilityMode = value)}
/>
