<script>
    export let ItemComponent;
    export let name;
    export let reducer;
</script>

{#if reducer.length}
    <h3 class="a5efc-category-heading">
        {name}
    </h3>

    {#each [...$reducer] as document}
        <svelte:component this={ItemComponent} {document} />
    {/each}
{/if}

<style>
    .a5efc-category-heading {
        display: flex;
        align-items: center;
        margin-block: 0;
        padding: 0.25rem 0.5rem;
        font-family: Signika, sans-serif;
        font-size: 0.833rem;
        line-height: 1;
        color: #f6f2eb;
        background: #425f65;
        border-bottom: none;
        border-radius: 3px;
        box-shadow: inset 0 0 10px #2e4246;
    }
</style>
