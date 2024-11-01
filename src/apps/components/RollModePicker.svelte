<script lang="ts">
    import { localize } from "#runtime/util/i18n";

    import RadioGroup from "./RadioGroup.svelte";

    export let selected: string;
    export let source: string;

    const rollModes: [string, string][] = Object.entries(CONFIG.A5E.rollModes ?? {});

    const options = rollModes.map(([key, value]) => [
        CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        localize(value),
    ]);

    $: buttons = source.length
        ? [{ classes: "fas fa-question-circle", tooltip: source }]
        : [];
</script>

<RadioGroup
    heading="A5E.RollModeHeading"
    {buttons}
    {options}
    {selected}
    allowDeselect={false}
    on:updateSelection
/>
