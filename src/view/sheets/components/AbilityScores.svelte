<script>
    import { getContext } from "svelte";

    import AbilityScore from "./AbilityScore.svelte";

    const actor = getContext("actor");
    let actorStore = $derived(actor.reactive.system);
</script>

<ul class="a5e-ability-scores">
    {#each Object.entries(actorStore.abilities) as [abilityKey, ability], idx}
        <AbilityScore {ability} {abilityKey} {idx} />
    {/each}
</ul>
