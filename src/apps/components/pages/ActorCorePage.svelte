<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import GenericActorResource from "../GenericActorResource.svelte";
    import Item from "../Item.svelte";

    export let resources;

    const actor = getContext("actor");
    const { favorites } = actor;

    $: resources = $actor.system.resources;
    $: flags = $actor.flags;
</script>

{#if !(flags.a5e?.hideGenericResources ?? $actor.type === "npc")}
    <ol class="resources-container">
        {#each Object.entries(resources) as [source, resource]}
            <GenericActorResource {resource} {source} />
        {/each}
    </ol>
{/if}

<header class="section-header">
    <i class="fas fa-star heading-icon" />

    <h3>
        {localize("A5E.FavoriteItems")}
    </h3>
</header>

<ul class="items-container">
    {#each [...$favorites] as item}
        <Item {item} />
    {/each}
</ul>

<style lang="scss">
    .heading-icon {
        font-size: 0.833rem;
    }

    .items-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        padding-right: 0.375rem;
        margin: 0;
        margin-right: -0.375rem;
        list-style: none;
        overflow-y: auto;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.25rem;
        padding-top: 0;
        margin-bottom: -0.25rem;
        border-bottom: 1px solid #ccc;
        font-size: 0.833rem;

        h3 {
            font-size: inherit;
        }
    }

    .resources-container {
        display: flex;
        gap: 0.5rem;
        width: 100%;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
