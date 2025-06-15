<script lang="ts">
    import type { Action } from "#types/action.d.ts";

    import { getContext } from "svelte";
    import { slide } from "svelte/transition";
    import { localize } from "#utils/localization/localize.ts";

    import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";
    import { getKeyPressAsOptions } from "#utils/view/getKeyPressAsOptions.ts";
    import { getSummaryData } from "#utils/summaries/getSummaryData.ts";

    import ItemListActionButtons from "./ItemListActionButtons.svelte";
    import ItemListData from "./ItemListData.svelte";
    import ItemListSummary from "./ItemListSummary.svelte";
    import Self from "./ItemList.svelte";

    type Props = {
        item: Item;
        action?: Action;
        actionId?: string;
        showDescription: boolean;
    };

    let { item, action, actionId, showDescription }: Props = $props();

    function determineActionListVisibility() {
        if (action) return false;

        // @ts-expect-error
        if (item.reactive.actions?.count < 2) {
            // @ts-expect-error
            return [...(item.actions?.values() ?? [])]?.some(
                (action) => action.uses?.value || action.uses?.max,
            );
        }

        // @ts-expect-error
        const actionListFlag = item.reactive.flags.a5e?.showActionList ?? true;
        if (actionListFlag === false) return false;

        if (game.settings.get("a5e", "collapseActionList") && sheetIsLocked())
            return false;

        return true;
    }

    function onItemActivate() {
        const options = getKeyPressAsOptions(pressedKeys);
        // @ts-expect-error
        item.activate(actionId, options);
    }

    async function onConfigure() {
        if (actionId) {
            // @ts-expect-error
            item.actions?.configure(actionId);
            return;
        }

        // @ts-expect-error
        item.configureItem();
    }

    function onDragStart(
        event: DragEvent & {
            currentTarget: EventTarget & HTMLLIElement;
        },
    ) {
        const dragData = item.toDragData();
        if (!dragData) return;

        // @ts-expect-error
        dragData.actorId = item?.parent.id;
        // @ts-expect-error
        if (actionId) dragData.actionId = actionId;

        return event.dataTransfer?.setData(
            "text/plain",
            JSON.stringify(dragData),
        );
    }

    function onDropObject(e) {}

    async function getDescription(item: Item) {
        const data =
            (await TextEditor.enrichHTML(
                actionId && action
                    ? action.description
                    : // @ts-expect-error
                      item.reactive.system.description,
                {
                    secrets: item.isOwner,
                    relativeTo: item,
                    rollData: actor?.getRollData(item) ?? {},
                },
            )) ?? localize("A5E.NoDescription");

        return data;
    }

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    let actorStore = $derived(actor.reactive.system);
    // @ts-expect-error
    let itemStore = $derived(item.reactive.system);

    const { A5E } = CONFIG;

    let rightClickConfigure =
        game.settings?.get("a5e", "itemRightClickConfigure") ?? false;

    let isGM = game.user?.isGM;

    let description = $derived.by(() =>
        // @ts-expect-error
        getDescription(item.reactive)
            .then((data) => (description = data))
            .catch((err) => (description = err)),
    );

    let containerItems = []; // TODO: V13 Update

    let showActionList = $derived(determineActionListVisibility());
    let showContainerItems = $derived(
        // @ts-expect-error
        item.reactive.flags.a5e?.showContainer ?? containerItems.length > 0,
    );
    // @ts-expect-error
    let summaryData = $derived(getSummaryData(item.reactive, action));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
    class="a5e-item"
    class:a5e-item--highlight={Number(itemStore.prepared ?? 0) ===
        A5E.PREPARED_STATES.PREPARED ||
        (itemStore.equippedState === A5E.EQUIPPED_STATES.EQUIPPED &&
            !itemStore?.containerId)}
    class:a5e-item--purple-highlight={Number(itemStore.prepared ?? 0) ===
        A5E.PREPARED_STATES.ALWAYS_PREPARED}
    class:a5e-item--red-highlight={itemStore.requiresBloodied}
    draggable="true"
    data-document-uuid={item.uuid}
    ondragstart={onDragStart}
    ondrop={(e) => onDropObject(e)}
    onclick={() => {
        showDescription = !showDescription;
    }}
    onauxclick={() => {
        if (rightClickConfigure) onConfigure();
    }}
>
    <button
        class="a5e-item__roll-button"
        class:a5e-item__roll-button--shift={pressedKeys.Shift}
        class:a5e-item__roll-button--ctrl={pressedKeys.Control}
        class:disable-pointer-events={!actor.isOwner}
        onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget?.blur();
            onItemActivate();
        }}
    >
        <img
            class="a5e-item__image"
            src={action?.img ?? item.img ?? "icons/svg/item-bag.svg"}
            alt={action?.name ?? item.name}
        />
        <img class="a5e-item__image--die" src="/icons/svg/d20.svg" alt="Roll" />
    </button>

    <ItemListData
        {actionId}
        {action}
        {item}
        toggleActionList={() => {
            showActionList = !showActionList;
            item.setFlag("a5e", "showActionList", showActionList);
        }}
        toggleContainer={() => {
            showContainerItems = !showContainerItems;
            item.setFlag("a5e", "showContainer", showContainerItems);
        }}
    />

    {#if actor.isOwner}
        <ItemListActionButtons action={actionId} {item} />
    {/if}
</li>

{#if showDescription}
    <div class="description-wrapper" transition:slide|local>
        {#if !isGM && item.reactive.isType("object") && itemStore.unidentified}
            {@html itemStore.unidentifiedDescription ??
                localize("A5E.NoUnidentifiedDescription")}
        {:else}
            {#if Object.values(summaryData).some(Boolean)}
                <ItemListSummary {summaryData} --margin-bottom="0.375rem" />

                {#if description}
                    <hr class="a5e-rule" style="margin-block: 0.5rem;" />
                {/if}
            {/if}

            {@html description}
        {/if}
    </div>
{/if}

{#if showActionList}
    <ul class="a5e-item-list a5e-item-list--sub-items">
        {#each [...(item?.reactive.actions?.entries() ?? [])] as [id, action] (id)}
            <Self {item} {action} actionId={id} />
        {/each}
    </ul>
{/if}

{#if showContainerItems}
    <ul class="a5e-item-list a5e-item-list--sub-items">
        {#each containerItems as [id, child] (id)}
            <svelte:self item={child} />
        {/each}
    </ul>
{/if}

<style lang="scss">
    .description-wrapper {
        padding: 0.25rem;
    }

    .disable-pointer-events {
        pointer-events: none;
    }
</style>
