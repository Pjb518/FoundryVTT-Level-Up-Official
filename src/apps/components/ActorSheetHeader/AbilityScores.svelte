<script>
    import { getContext } from "svelte";

    import AbilityScore from "./AbilityScore.svelte";

    const actor = getContext("actor");
</script>

<ul class="ability-scores">
    {#each Object.entries($actor.system.abilities) as [abilityLabel, ability]}
        <AbilityScore {ability} {abilityLabel} />
    {/each}
</ul>

<style lang="scss">
    .ability-scores {
        display: flex;
        position: relative;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }
</style>
