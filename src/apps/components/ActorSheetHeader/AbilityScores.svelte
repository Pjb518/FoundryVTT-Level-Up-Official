<script>
    import { getContext } from "svelte";

    import AbilityScore from "./AbilityScore.svelte";
    import AbilityScoreWrapper from "./AbilityScoreWrapper.svelte";

    const actor = getContext("actor");
</script>

<ul class="core-stat-list">
    {#each Object.entries($actor.system.abilities) as [abilityLabel, ability]}
        <AbilityScoreWrapper heading={abilityLabel}>
            <AbilityScore {ability} {abilityLabel} />
        </AbilityScoreWrapper>
    {/each}
</ul>

<style lang="scss">
    .core-stat-list {
        display: flex;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: "Modesto Condensed", serif;
    }
</style>
