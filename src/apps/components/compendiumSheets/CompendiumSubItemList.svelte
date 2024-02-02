<script>
    import Section from "../Section.svelte";

    export let ItemComponent;
    export let name;
    export let reducer;
</script>

{#if reducer.length}
    <Section heading={name} --a5e-section-gap="0">
        <ul class="a5e-item-list a5e-item-list--compendium">
            {#each [...$reducer] as document}
                <svelte:component this={ItemComponent} {document} />
            {/each}
        </ul>
    </Section>
{/if}
