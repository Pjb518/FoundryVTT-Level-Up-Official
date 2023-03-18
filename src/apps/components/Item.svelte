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
    let isGM = game.user.isGM;

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

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li
    class="item-wrapper"
    class:item-wrapper--locked={sheetIsLocked}
    class:item-wrapper--object={item.type === "object"}
    class:item-wrapper--locked-object={sheetIsLocked && item.type === "object"}
    draggable="true"
    on:dragstart={onDragStart}
    on:click={() => {
        showDescription = !showDescription;
    }}
    on:auxclick={() => {
        if (rightClickConfigure) onConfigure();
    }}
>
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

    <ItemInnerWrapper {actionId} {action} {item} />

    {#if !$actor.pack && $actor.isOwner}
        <ItemActionButtons action={actionId} {item} />
    {/if}
</li>

{#if showDescription}
    <div class="description-wrapper">
        {#if !isGM && item.type === "object" && item.system.unidentified}
            {@html item.system.unidentifiedDescription ??
                localize("A5E.NoUnidentifiedDescription")}
        {:else}
            <svelte:component
                this={getSummaryComponent(item)}
                {actionId}
                {item}
            />

            {@html (actionId ? action.description : item.system.description) ??
                localize("A5E.NoDescription")}
        {/if}
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

    .item-wrapper {
        position: relative;
        display: grid;
        grid-template-areas:
            "icon name       usesLabel menu"
            "icon indicators uses      menu";
        grid-template-columns: min-content 1fr 100px min-content;
        column-gap: 0.75rem;
        row-gap: 0;
        align-items: center;
        width: 100%;
        padding: 0.125rem;
        padding-right: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.05);

        &--locked {
            grid-template-areas:
                "icon name       usesLabel"
                "icon indicators uses";
            grid-template-columns: min-content 1fr 100px;
        }

        &--object {
            grid-template-areas:
                "icon name       usesLabel quantityLabel menu"
                "icon indicators uses      quantity      menu";
            grid-template-columns: min-content 1fr 100px min-content min-content;
        }

        &--locked-object {
            grid-template-areas:
                "icon name        usesLabel quantityLabel"
                "icon indicators  uses      quantity";
            grid-template-columns: min-content 1fr 100px min-content;
        }
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
        width: 2.25rem;
        height: 2.25rem;
        flex-shrink: 0;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: 3px;
        grid-area: icon;

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
