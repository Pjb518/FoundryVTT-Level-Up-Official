<script lang="ts">
    import type { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
    import type { Grant } from "../../../../types/grants";

    import { getContext } from "svelte";

    export let grant: Grant;
    const item: TJSDocument = getContext("item");

    function onDragStart() {}

    async function onAuxClick() {
        grant.configureGrant();
    }
</script>

<li
    class="grant-wrapper"
    draggable="true"
    on:dragstart={onDragStart}
    on:auxclick={onAuxClick}
>
    <div class="grant-information-wrapper">
        <img
            class="grant-image"
            src={grant.img || $item.img || "icons/svg/upgrade.svg"}
            alt="{grant.grantType} Grant"
        />
    </div>

    {grant.grantType}
</li>

<style lang="scss">
    .grant-wrapper {
        position: relative;
        display: grid;
        column-gap: 0.5rem;
        row-gap: 0;
        align-items: center;
        width: 100%;
        padding: 0.125rem;
        padding-right: 0.5rem;
        padding-left: 0.25rem;
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;
        background: var(--item-background, rgba(0, 0, 0, 0.05));
    }

    .grant-image {
        display: block;
        width: 1.5rem;
        object-fit: cover;
    }
</style>
