<script>
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import PartyViewerCoreSummary from "./PartyViewerCoreSummary.svelte";
    import PartyViewerResourceSummary from "./PartyViewerResourceSummary.svelte";

    export let uuid;
    export let currentViewMode = "core";

    function getViewModeComponent(viewMode) {
        switch (viewMode) {
            case "core":
                return PartyViewerCoreSummary;
            case "resources":
                return PartyViewerResourceSummary;
            default:
                return PartyViewerCoreSummary;
        }
    }

    const actor = new TJSDocument();
    actor.setFromUUID(uuid);
</script>

<li class="party-member">
    <img class="actor-image" src={$actor?.img} alt={$actor?.name} />
    <span>{$actor?.name}</span>

    <svelte:component this={getViewModeComponent(currentViewMode)} {actor} />
</li>

<style lang="scss">
    .actor-image {
        height: 2.25rem;
        width: 2.25rem;
        margin: 0;
        padding: 0;
        object-fit: cover;
    }

    .party-member {
        display: grid;
        grid-template-columns: max-content 1fr;
        align-items: center;
        gap: 0.5rem;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;
        background: var(--item-background, rgba(0, 0, 0, 0.05));
    }
</style>
