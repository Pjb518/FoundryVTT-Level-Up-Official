<script>
    import { localize } from "#runtime/svelte/helper";

    export let heading = null;
    export let hint = null;
    export let showWarning = false;
    export let warning = null;
</script>

<section class="a5e-field-wrapper">
    {#if heading}
        <h3 class="a5e-field-wrapper__heading">{localize(heading)}</h3>
    {/if}

    <slot />

    {#if hint}
        <small class="a5e-field-wrapper__hint">{localize(hint)}</small>
    {/if}

    {#if showWarning}
        <small class="a5e-field-wrapper__warning">
            <i class="fa-solid fa-circle-exclamation" />
            {localize(warning)}
        </small>
    {/if}
</section>
