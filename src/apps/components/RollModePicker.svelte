<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import RadioGroup from "./RadioGroup.svelte";

    export let selected: string;
    export let source: string;

    const rollModes: [string, string][] = Object.entries(
        CONFIG.A5E.rollModes ?? {},
    );

    const options = rollModes.map(([key, value]) => [
        CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        localize(value),
    ]);

    $: buttons = source.length
        ? [{ classes: "icon fas fa-question-circle", tooltip: source }]
        : [];
</script>

<RadioGroup
    heading="A5E.rollLabels.modeHeading"
    {buttons}
    {options}
    {selected}
    allowDeselect={false}
    on:updateSelection
/>
