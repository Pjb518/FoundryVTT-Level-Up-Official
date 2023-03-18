<script>
    // import { slide } from "svelte/transition";
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import pressedKeysStore from "../../stores/pressedKeysStore";
    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";

    import ItemActionButtons from "./ItemActionButtons.svelte";
    import FeatureSummary from "./itemSummaries/FeatureSummary.svelte";
    import ManeuverSummary from "./itemSummaries/ManeuverSummary.svelte";
    import ObjectSummary from "./itemSummaries/ObjectSummary.svelte";
    import SpellSummary from "./itemSummaries/SpellSummary.svelte";
    import ItemInnerWrapper from "./ItemInnerWrapper.svelte";

    export let item;
    export let action = null;
    export let actionId = null;

    const actor = getContext("actor");

    let showDescription = false;
    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

    function getSummaryComponent(item) {
        switch (item?.type) {
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

    function onItemActivate() {
        const options = getKeyPressAsOptions($pressedKeysStore);
        item.activate(actionId, options);
    }

    async function onConfigure() {
        if (action) {
            await item.actions.configure(actionId);
            return;
        }

        item.configureItem();
    }

    function onDragStart(event) {
        const dragData = item.toDragData();
        if (!dragData) return;

        dragData.actorId = item?.parent.id;

        return event.dataTransfer.setData(
            "text/plain",
            JSON.stringify(dragData)
        );
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li class="item-wrapper" draggable="true" on:dragstart={onDragStart}>
    <button
        class="item-roll-button"
        class:item-roll-button--shift={$pressedKeysStore.Shift}
        class:item-roll-button--ctrl={$pressedKeysStore.Control}
        class:disable-pointer-events={!$actor.isOwner}
        on:click|stopPropagation={({ target }) => {
            target.blur();
            onItemActivate();
        }}
    >
        <img
            class="item-image"
            src={action?.img ?? item.img ?? "icons/svg/item-bag.svg"}
            alt={action?.name ?? item.name}
        />
        <img class="item-image--die" src="/icons/svg/d20.svg" alt="Roll" />
    </button>

    <div
        class="inner-wrapper"
        on:click={() => {
            showDescription = !showDescription;
        }}
        on:auxclick={() => {
            if (rightClickConfigure) onConfigure();
        }}
    >
        <ItemInnerWrapper {actionId} {action} {item} />
    </div>

    {#if !$actor.pack && $actor.isOwner}
        <ItemActionButtons action={actionId} {item} />
    {/if}
</li>

{#if showDescription}
    <div class="description-wrapper">
        <svelte:component this={getSummaryComponent(item)} {actionId} {item} />

        {@html (actionId ? action.description : item.system.description) ??
            localize("A5E.NoDescription")}
    </div>
{/if}

{#if !action && item?.actions?.count > 1}
    <ul class="actions-list">
        {#each item?.actions?.entries() as [id, action] (id)}
            <svelte:self {item} {action} actionId={id} />
        {/each}
    </ul>
{/if}

<style lang="scss">
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

    .disable-pointer-events {
        pointer-events: none;
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .inner-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-grow: 1;
        cursor: pointer;
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
    }

    .item-image {
        display: block;
        height: 100%;
        width: auto;

        &--die {
            display: none;
            padding: 0;
            margin: 0;
        }
    }

    .item-roll-button {
        width: 2.438rem;
        height: 2.438rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: 3px;

        &:hover {
            box-shadow: none;

            .item-image {
                display: none;
            }

            .item-image--die {
                display: block;
            }
        }

        &--shift:hover {
            filter: invert(34%) sepia(4%) saturate(4360%) hue-rotate(143deg)
                brightness(78%) contrast(65%);
        }

        &--ctrl:hover {
            filter: invert(15%) sepia(27%) saturate(4731%) hue-rotate(338deg)
                brightness(101%) contrast(95%);
        }
    }
</style>
