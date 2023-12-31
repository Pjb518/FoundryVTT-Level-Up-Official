<script>
    import { getContext } from "svelte";

    import AbilityScore from "./AbilityScore.svelte";

    const actor = getContext("actor");
</script>

<ul class="a5e-ability-scores">
    {#each Object.entries($actor.system.abilities) as [abilityLabel, ability], idx}
        <AbilityScore {ability} {abilityLabel} {idx} />
    {/each}
</ul>
