<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let heading = null;
    export let hint = null;
    export let inline = false;
</script>

<div
    class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative"
    class:u-align-center={inline}
>
    {#if heading}
        <h3 class="form-heading u-flex-shrink-0" class:u-w-30={inline}>
            {localize(heading)}
        </h3>
    {/if}

    <slot />

    {#if hint}
        <small>{localize(hint)}</small>
    {/if}
</div>

<style lang="scss">
    .form-heading {
        font-size: 0.833rem;
        font-weight: bold;
    }

    small {
        display: block;
        width: 100%;
        padding-inline: 0.25rem;
    }
</style>
