<script>
    import AbilityScore from "./AbilityScore.svelte";
    import StatusTrack from "./StatusTrack.svelte";
    import Health from "./Health.svelte";
    import ArmorClass from "./ArmorClass.svelte";

    export let actor;
</script>

<header class="sheet-header">
    <div class="a5e-sheet-header__left">
        <img
            src={$actor.img}
            alt={$actor.name}
            title={$actor.name}
            data-edit="img"
            class="a5e-image a5e-image--actor-header"
        />

        <StatusTrack
            {actor}
            icon="fa-running"
            tooltipText="A5E.Fatigue"
            trackProperty="fatigue"
            value={$actor.system.attributes.fatigue}
        />

        <StatusTrack
            {actor}
            icon="fa-brain"
            tooltipText="A5E.Strife"
            trackProperty="strife"
            value={$actor.system.attributes.strife}
        />

        <Health {actor} />
    </div>

    <ul class="ability-score-list">
        <ArmorClass {actor} />
        {#each Object.entries($actor.system.abilities) as [abilityLabel, ability]}
            <AbilityScore {ability} {abilityLabel} {actor} />
        {/each}
    </ul>
</header>

<style>
    .ability-score-list {
        display: flex;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }

    .sheet-header {
        display: grid;
        padding: 1rem;
        padding-bottom: 0.75rem;
        column-gap: 1rem;
        grid-template-areas:
            "left primary-details"
            "left secondary-details"
            "left movement"
            "left primary-attributes";
        grid-template-columns: max-content 1fr;
        row-gap: 0.25rem;
    }
</style>
