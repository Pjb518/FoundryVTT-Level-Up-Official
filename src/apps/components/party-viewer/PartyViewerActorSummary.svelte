<script>
    import { createEventDispatcher } from "svelte";

    import PartyViewerCoreSummary from "./PartyViewerCoreSummary.svelte";
    import PartyViewerResourceSummary from "./PartyViewerResourceSummary.svelte";
    import PartyViewerWealthSummary from "./PartyViewerWealthSummary.svelte";

    export let actor;
    export let currentViewMode = "core";
    export let highestPassiveScores = {};

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

    const dispatch = createEventDispatcher();

    $: viewComponent = getViewModeComponent(currentViewMode);
</script>

<li class="party-member" on:dblclick={() => $actor?.sheet.render(true)}>
    <img class="actor-image" src={$actor?.img} alt={$actor?.name} />
    <span class="actor-name">{$actor?.name}</span>

    <svelte:component
        this={viewComponent}
        {actor}
        propData={{ highestPassiveScores }}
    />

    <span class="delete-wrapper">
        <button
            class="a5e-button a5e-button--delete delete-button fas fa-trash"
            data-tooltip="Remove Actor from the Party"
            data-tooltip-direction="UP"
            on:click={() => dispatch("remove-actor", $actor.uuid)}
        />
    </span>
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

    .delete-button {
        padding: 0.25rem;
        grid-area: delete;
    }

    .delete-wrapper {
        text-align: center;
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
