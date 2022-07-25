<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
    import { getContext } from "svelte";

    import AbilityScore from "../components/AbilityScore.svelte";

    export let { actorId } = getContext("external").application;
    export let elementRoot;

    const actor = new TJSDocument(game.actors.get(actorId));
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <ul class="ability-score-list">
            {#each Object.entries($actor.system.abilities) as [abilityLabel, ability]}
                <AbilityScore {ability} {abilityLabel} {actor} />
            {/each}
        </ul>
    </main>
</ApplicationShell>

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
