<script>
    import AbilityScore from "./AbilityScore.svelte";

    export let actor;
</script>

<header>
    <ul class="ability-score-list">
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
</style>
