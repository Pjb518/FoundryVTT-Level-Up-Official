<script>
    import { slide } from "svelte/transition";

    import ItemActionButtons from "./ItemActionButtons.svelte";
    import FeatureSummary from "./itemSummaries/FeatureSummary.svelte";
    import ManeuverSummary from "./itemSummaries/ManeuverSummary.svelte";
    import ObjectSummary from "./itemSummaries/ObjectSummary.svelte";
    import SpellSummary from "./itemSummaries/SpellSummary.svelte";

    export let item;

    function getSummaryComponent(item) {
        switch (item.type) {
            case "feature":
                return FeatureSummary;
            case "maneuver":
                return ManeuverSummary;
            case "object":
                return ObjectSummary;
            case "spell":
                return SpellSummary;
        }
    }

    let showDescription = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
    class="item-wrapper"
    draggable="true"
    on:click={() => {
        showDescription = !showDescription;
    }}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
        class="item-image"
        src={item.img}
        alt={item.name}
        on:click|stopPropagation={() => item.activate()}
    />

    {item.name}

    <ItemActionButtons {item} />
</li>

{#if showDescription}
    <div class="description-wrapper" transition:slide>
        <svelte:component this={getSummaryComponent(item)} {item} />

        {@html item.system.description}
    </div>
{/if}

{#if item.actions.count > 1}
    <ul class="actions-list">
        {#each item.actions.entries() as [id, action]}
            <li class="item-wrapper" draggable="false">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <img
                    class="item-image"
                    src={action.img ?? "icons/svg/item-bag.svg"}
                    alt={action.name}
                    on:click|stopPropagation={() => item.activate(id)}
                />

                {action.name}
            </li>
        {/each}
    </ul>
{/if}

<style>
    .actions-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 0;
        padding: 0 0 0 1rem;
    }

    .description-wrapper {
        padding: 0.125rem 0.25rem;
    }

    .item-wrapper {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        height: fit-content;
        width: 100%;
        gap: 0.5rem;
        padding: 0.125rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);
        cursor: pointer;
    }

    .item-image {
        height: 1.75rem;
        width: 1.75rem;
        border-radius: 3px;
    }
</style>
