<script>
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import PartyViewerCoreSummary from "./PartyViewerCoreSummary.svelte";
    import PartyViewerResourceSummary from "./PartyViewerResourceSummary.svelte";
    import PartyViewerWealthSummary from "./PartyViewerWealthSummary.svelte";

    export let uuid;
    export let currentViewMode = "core";

    function getViewModeComponent(viewMode) {
        switch (viewMode) {
            case "core":
                return PartyViewerCoreSummary;
            case "resources":
                return PartyViewerResourceSummary;
            case "wealth":
                return PartyViewerWealthSummary;
            default:
                return PartyViewerCoreSummary;
        }
    }

    const actor = new TJSDocument();
    actor.setFromUUID(uuid);

    $: viewComponent = getViewModeComponent(currentViewMode);
</script>

<li class="party-member" on:dblclick={() => $actor?.sheet.render(true)}>
    <img class="actor-image" src={$actor?.img} alt={$actor?.name} />
    <span class="actor-name">{$actor?.name}</span>

    <svelte:component this={viewComponent} {actor} />
</li>

<style lang="scss">
    .actor-image {
        height: 2rem;
        width: 2rem;
        margin: 0;
        padding: 0;
        object-fit: cover;
        grid-area: img;
    }

    .actor-name {
        grid-area: name;
        padding-left: 0.5rem;
        text-overflow: ellipsis;
    }

    .party-member {
        display: grid;
        grid-template-areas: var((--grid-areas));
        grid-template-columns: var(--grid-template);
        align-items: center;
        gap: 0.5rem;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;
        background: var(--item-background, rgba(0, 0, 0, 0.05));
        cursor: pointer;
    }
</style>
