<script>
    // import { slide } from "svelte/transition";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import pressedKeysStore from "../../stores/pressedKeysStore";
    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    import ItemActionButtons from "./ItemActionButtons.svelte";
    import FeatureSummary from "./itemSummaries/FeatureSummary.svelte";
    import ManeuverSummary from "./itemSummaries/ManeuverSummary.svelte";
    import ObjectSummary from "./itemSummaries/ObjectSummary.svelte";
    import SpellSummary from "./itemSummaries/SpellSummary.svelte";

    export let item;
    export let action = null;
    export let actionId = null;

    let showDescription = false;
    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

    let backgroundImage = action?.img ?? item.img ?? "icons/svg/item-bag.svg";

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
        class="item-image"
        class:item-image--shift={$pressedKeysStore.Shift}
        class:item-image--ctrl={$pressedKeysStore.Control}
        style="--background-image: url(/{backgroundImage});"
        on:click|stopPropagation={onItemActivate}
    />

    <div
        class="inner-item-wrapper"
        on:click={() => {
            showDescription = !showDescription;
        }}
        on:auxclick={() => {
            if (rightClickConfigure) onConfigure();
        }}
    >
        <div class="item-name">
            {action?.name ?? item.name}
        </div>

        {#if !actionId && item.type === "object"}
            <input
                class="item-quantity"
                type="number"
                name="system.quantity"
                value={item?.system?.quantity ?? 1}
                placeholder="1"
                min="0"
                max="9999"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        item,
                        target.name,
                        Number(target.value)
                    )}
            />
        {/if}
    </div>

    <ItemActionButtons action={actionId} {item} />
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
        {#each item?.actions?.entries() as [id, action]}
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

    .inner-item-wrapper {
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

    .item-name {
        display: flex;
        height: 1.75rem;
        align-items: center;
    }

    .item-image {
        position: relative;
        height: 1.75rem;
        width: 1.75rem;
        background: no-repeat center/100% var(--background-image);
        border-radius: 3px;
        transition: all 0.15s ease-in-out;

        &:hover,
        &:focus {
            box-shadow: none;
            background: no-repeat center/100% url("/icons/svg/d20.svg");
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

    .item-quantity {
        height: 1.25rem;
        width: 7ch;
        text-align: center;
        border: 1px solid #bbb;
        background: transparent;
    }
</style>
