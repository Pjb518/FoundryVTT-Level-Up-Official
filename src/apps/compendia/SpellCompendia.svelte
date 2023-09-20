<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { getContext, setContext } from "svelte";

    export let { document, sheet } = getContext("#external").application;
    export let elementRoot;

    console.log(document);
</script>

<ApplicationShell bind:elementRoot>
    {#each document.index as { name }}
        {name}
        <br />
    {/each}
</ApplicationShell>
