<script>
    export let ItemComponent;
    export let name;
    export let reducer;
</script>

{#if reducer.length}
    <header class="a5e-section-header">
        <h3 class="a5e-section-header__heading">
            {name}
        </h3>
    </header>

    {#each [...$reducer] as document}
        <svelte:component this={ItemComponent} {document} />
    {/each}
{/if}
