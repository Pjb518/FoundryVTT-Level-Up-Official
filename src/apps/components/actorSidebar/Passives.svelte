<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    export let passiveFields;

    const actor = getContext("actor");

    $: passiveFields = [
        {
            label: "A5E.ManeuverDC",
            value: $actor.system.attributes.maneuverDC,
        },
        {
            label: "A5E.SpellDC",
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
    <div class="passive-box">
        <h4 class="passive-label">{localize(label)}</h4>

        <div
            class="passive-value"
            data-tooltip={tooltip ?? ""}
            data-tooltip-direction="UP"
        >
            {value}
        </div>
    </div>
{/each}

<style lang="scss">
    .passive-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        padding: 0.125rem 0;
        font-family: $font-primary;
        color: var(--a5e-color-text-medium);
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: $color-light-background;
        box-shadow: 0 0 5px #ccc inset;
    }

    .passive-label {
        font-size: var(--a5e-text-size-xs);
    }

    .passive-value {
        color: black;
        text-align: center;
        padding-inline: 0.25rem;
        font-size: var(--a5e-text-size-md);
    }
</style>
