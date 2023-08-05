<script>
    import { localize } from "#runtime/svelte/helper";

    export let heading = null;
    export let hint = null;
    export let showWarning = false;
    export let warning = null;
</script>

<section class="form-section">
    {#if heading}
        <h3 class="form-heading">{localize(heading)}</h3>
    {/if}

    <slot />

    {#if hint}
        <small class="hint">{localize(hint)}</small>
    {/if}

    {#if showWarning}
        <small class="warning">
            <i class="fa-solid fa-circle-exclamation" />
            {localize(warning)}
        </small>
    {/if}
</section>

<style lang="scss">
    .form-section {
        position: relative;
        display: flex;
        flex-direction: var(--direction, row);
        flex-wrap: wrap;
        flex-grow: var(--grow, 0);
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
        flex-shrink: 1;
        width: var(--label-width, auto);
        border-bottom: 0;
        margin-bottom: 0;
    }

    .hint,
    .warning {
        display: block;
        width: 100%;
        padding-right: 0.25rem;
        font-family: "Signika", sans-serif;
        font-size: 0.694rem;
    }

    .warning {
        color: #8b6225;
    }
</style>
