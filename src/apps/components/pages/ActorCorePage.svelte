<script>
    import { getContext } from "svelte";

    import GenericActorResource from "../GenericActorResource.svelte";
    import ItemCategory from "../ItemCategory.svelte";

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

<ItemCategory
    label="A5E.FavoriteItems"
    icon="fas fa-star heading-icon"
    items={[...$favorites]}
    type="favorites"
/>

<style lang="scss">
    .resources-container {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        width: 100%;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
