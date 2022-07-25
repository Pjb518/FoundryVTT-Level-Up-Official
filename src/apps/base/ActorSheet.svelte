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
        <ul class="u-flex u-font-serif u-gap-md u-list-style-none u-m-0 u-pl-0">
            {#each Object.entries($actor.system.abilities) as [abilityLabel, ability]}
                <AbilityScore {ability} {abilityLabel} {actor} />
            {/each}
        </ul>
    </main>
</ApplicationShell>

<style>
</style>
