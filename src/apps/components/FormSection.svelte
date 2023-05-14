<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let heading = null;
    export let hint = null;
</script>

<section class="form-section">
    {#if heading}
        <h3 class="form-heading">{localize(heading)}</h3>
    {/if}

    <slot />

    {#if hint}
        <small>{localize(hint)}</small>
    {/if}
</section>

<style lang="scss">
    .form-section {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: var(--item-alignment, initial);
        gap: var(--gap, 0.375rem);
        margin: var(--margin, 0);
        padding: var(--padding, 0.5rem);
        background: var(--background, rgba(0, 0, 0, 0.05));
        border-radius: 3px;
    }

    .form-heading {
        font-size: 0.833rem;
        font-weight: bold;
        flex-shrink: 0;
        width: var(--label-width, auto);
    }

    small {
        display: block;
        width: 100%;
        padding-right: 0.25rem;
    }
</style>
