<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        selected: string;
        source: string;
        onUpdateSelection: (value: string) => void;
    };

    let { selected, source, onUpdateSelection }: Props = $props();

    const rollModes: [string, string][] = Object.entries(
        CONFIG.A5E.rollModes ?? {},
    );

    const options = rollModes.map(([key, value]) => [
        CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        localize(value),
    ]);

    let buttons = $derived(
        source.length
            ? [{ classes: "icon fas fa-question-circle", tooltip: source }]
            : [],
    );
</script>

<RadioGroup
    heading="A5E.rollLabels.modeHeading"
    {buttons}
    {options}
    {selected}
    allowDeselect={false}
    {onUpdateSelection}
/>
