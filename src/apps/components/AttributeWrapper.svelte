<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    export let heading;
</script>

<li class="attribute-container">
    <h4 class="attribute-heading">{localize(heading)}</h4>

    <slot />
</li>

<style lang="scss">
    .attribute-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
        background: rgba(0, 0, 0, 0.05);
        font-family: "Modesto Condensed", serif;
        border-radius: 3px;
        width: 100%;
    }

    .attribute-heading {
        font-size: 1.2rem;
    }
</style>
