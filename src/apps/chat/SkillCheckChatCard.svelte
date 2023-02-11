<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import RollTooltip from "./tooltip/RollTooltip.svelte";

    export let messageDocument;

    const message = new TJSDocument(messageDocument);

    const actor = new TJSDocument(fromUuidSync($message.flags?.a5e?.actorId));
    const { abilityKey, skillKey } = $message.flags?.a5e;
    const { abilities, skills } = CONFIG.A5E;

    let tooltipIsVisible = false;
</script>

<header class="card-header">
    <img
        class="actor-image"
        src={$actor.img ?? $actor.actor.img}
        alt={$actor.name}
    />

    <div>
        <h2 class="card-title">{`${localize(skills[skillKey])} Check`}</h2>

        <h3 class="card-subtitle">
            {localize(abilities[abilityKey] ?? "No Ability Selected")}
        </h3>
    </div>
</header>

<hr class="a5e-rule a5e-rule--card" />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="a5e-roll a5e-js-toggle-roll-tooltip-visibility roll-formula"
    on:click={() => {
        tooltipIsVisible = !tooltipIsVisible;
    }}
>
    {$message.rolls[0].formula}
</div>

{#each $message.rolls as roll}
    {#if tooltipIsVisible}
        <RollTooltip {roll} />
    {/if}
{/each}

<div class="a5e-roll a5e-roll--total">
    {$message.rolls[0].total}
</div>

<style lang="scss">
    .actor-image {
        border: 0;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 4px;
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-bottom: 0;
    }

    .card-title {
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: bold;
        border-bottom: 0;
    }

    .card-subtitle {
        margin-bottom: 0;
        font-size: 0.833rem;
        border-bottom: 0;
        color: #7e7960;
    }

    .roll-formula {
        word-break: keep-all;
    }
</style>
