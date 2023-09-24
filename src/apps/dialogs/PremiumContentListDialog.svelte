<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
    import { ApplicationShell } from "#runtime/svelte/component/core";

    export let elementRoot;
</script>

<ApplicationShell bind:elementRoot>Test</ApplicationShell>

<style lang="scss">
    :global(.a5e-premium-content-list-dialog) {
        min-width: 400px;
        min-height: 500px;
        max-height: 90vh;
    }

    :global(.a5e-premium-content-list-dialog .window-content) {
        padding: 0.5rem;
    }
</style>
