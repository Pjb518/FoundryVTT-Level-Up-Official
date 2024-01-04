<script>
    import Section from "../Section.svelte";

    export let ItemComponent;
    export let name;
    export let reducer;
</script>

{#if reducer.length}
    <Section heading={name}>
        {#each [...$reducer] as document}
            <svelte:component this={ItemComponent} {document} />
        {/each}
    </Section>
{/if}
