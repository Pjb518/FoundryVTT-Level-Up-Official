<script>
    // import { slide } from "svelte/transition";
    import { getContext } from "svelte";
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

    const actor = getContext("actor");

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<li class="item-wrapper" draggable="true" on:dragstart={onDragStart}>
    <button
        class="item-roll-button"
        class:item-roll-button--shift={$pressedKeysStore.Shift}
        class:item-roll-button--ctrl={$pressedKeysStore.Control}
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
        class="inner-item-wrapper"
        on:click={() => {
            showDescription = !showDescription;
        }}
        on:auxclick={() => {
            if (rightClickConfigure) onConfigure();
        }}
    >
        <div class="name-wrapper">
            <div
                class="item-name"
                class:item-name-object={!actionId && item.type === "object"}
            >
                {action?.name ?? item.name}
            </div>
        </div>

        {#if !actionId && item.type === "object"}
            <div class="wrapper-text label-wrapper">
                <label for="current"> Quantity </label>
                <input
                    class="item-quantity"
                    type="number"
                    name="system.quantity"
                    value={item?.system?.quantity ?? 1}
                    placeholder="1"
                    min="0"
                    max="9999"
                    on:click|stopPropagation
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            item,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        {/if}
        {#if item.system.uses.max && !actionId}
            <div class="wrapper-text label-wrapper">
                <label for="current"> Uses </label>
                <div class="input-wrapper">
                    <input
                        class="item-quantity"
                        id="current"
                        type="number"
                        name="system.uses.value"
                        value={item.system.uses.value}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                item,
                                target.name,
                                Number(target.value)
                            )}
                    />
                    <span>/</span>
                    <input
                        class="item-quantity"
                        type="number"
                        d-type="Number"
                        disabled={sheetIsLocked}
                        name="system.uses.max"
                        value={item.system.uses.max}
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                item,
                                target.name,
                                Number(target.value)
                            )}
                    />
                </div>
            </div>
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
        {#each item?.actions?.entries() as [id, action] (id)}
            <svelte:self {item} {action} actionId={id} />
        {/each}
    </ul>
{/if}

<style lang="scss">
    .wrapper-text {
        text-align: center;
        font-size: 0.694rem;
    }
    .label-wrapper {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 0.694rem;
        padding: 0.15rem;
        gap: 0.1rem;
    }
    .input-wrapper {
        flex-direction: row;
    }
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

    .name-wrapper {
        display: flex;
        height: 1.75rem;
        font-size: 0.833rem;
    }

    .item-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        align-items: center;
        height: 1.75rem;
        width: 14.908rem;
        font-size: 0.833rem;
    }

    .item-name-object {
        width: 8rem;
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

    .item-quantity {
        height: 1.25rem;
        width: 7ch;
        text-align: center;
        border: 1px solid #bbb;
        background: transparent;
    }
</style>
