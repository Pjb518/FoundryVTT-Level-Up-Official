<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    export let passiveFields;

    const actor = getContext("actor");

    $: passiveFields = [
        {
            label: "A5E.ManeuverDC",
            value: $actor.system.attributes.maneuverDC,
        },
        {
            label: "A5E.spells.dc",
            value: $actor.system.attributes.spellDC,
            tooltip: $actor.spellBooks.getSpellDCString(true),
        },
        {
            label: "Passive Percep.",
            value: $actor.system.skills.prc.passive,
        },
    ];
</script>

{#each passiveFields as { label, value, tooltip }}
    <div class="a5e-details-box">
        <h4 class="a5e-details-box__label">{localize(label)}</h4>

        <div
            class="a5e-details-box__input"
            data-tooltip={tooltip ?? ""}
            data-tooltip-direction="UP"
        >
            {value}
        </div>
    </div>
{/each}

<style lang="scss">
</style>
