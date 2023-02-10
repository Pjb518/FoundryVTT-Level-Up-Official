<script>
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let messageDocument;

    const message = new TJSDocument(messageDocument);
    const actor = new TJSDocument(fromUuidSync($message.flags?.a5e?.actorId));
    const { abilityKey, skillKey } = $message.flags?.a5e;
    const { abilities, skills } = CONFIG.A5E;
</script>

<header class="card-header">
    <img class="a5e-image a5e-image--card" src={$actor.img} alt={$actor.name} />

    <div>
        <h2 class="card-title">{`${localize(skills[skillKey])} Check`}</h2>

        <h3 class="card-subtitle">
            {localize(abilities[abilityKey] ?? "No Ability Selected")}
        </h3>
    </div>
</header>

<hr class="a5e-rule a5e-rule--card" />

<div class="a5e-roll a5e-js-toggle-roll-tooltip-visibility">
    {$message.rolls[0].formula}
</div>

<div class="a5e-roll a5e-roll--total">
    {$message.rolls[0].total}
</div>

<style lang="scss">
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
</style>
