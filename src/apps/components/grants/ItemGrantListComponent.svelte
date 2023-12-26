<script lang="ts">
    import type { Grant } from "../../../../types/grants";

    import { getContext } from "svelte";

    import GenericConfigDialog from "../../dialogs/initializers/GenericConfigDialog";

    export let grant: Grant;
    export let component: any;

    function onDragStart() {}

    async function onAuxClick() {
        grant.configureGrant("Some Title", { grantId: grant._id }, {});
    }

    console.log(grant);
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
            src={grant.img ?? "icons/svg/upgrade.svg"}
            alt="{grant.grantType} Grant"
        />
    </div>
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
