<script>
    import { getContext } from "svelte";

    export let passiveFields;

    const actor = getContext("actor");

    $: passiveFields = [
        {
            label: "Maneuver DC",
            value: $actor.system.maneuverDC,
        },
        {
            label: "Spell DC",
            value: $actor.system.spellDC,
        },
        {
            label: "Passive Percep.",
            value: $actor.system.skills.prc.passive,
        },
    ];
</script>

{#each passiveFields as { label, value }}
    <div class="passive-box">
        <h4 class="passive-label">{label}</h4>

        <div class="passive-value">
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
        font-family: "Modesto Condensed", serif;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f6f2eb;
        box-shadow: 0 0 5px #ccc inset;
    }

    .passive-label {
        font-size: 0.694rem;
    }

    .passive-value {
        color: black;
        text-align: center;
        padding-inline: 0.25rem;
        font-size: 1rem;
    }
</style>
