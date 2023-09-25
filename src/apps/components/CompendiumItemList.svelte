<script>
    import CompendiumSpellItem from "./CompendiumSpellItem.svelte";

    const compendiumItemComponents = {
        spell: CompendiumSpellItem,
    };

    export let documents = [];
    export let compendiumType;
</script>

<ul class="document-list">
    {#each documents as document}
        <svelte:component
            this={compendiumItemComponents[compendiumType]}
            {document}
        />
    {/each}
</ul>

<style lang="scss">
    .document-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
