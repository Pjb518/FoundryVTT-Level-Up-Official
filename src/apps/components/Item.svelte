<script>
    import { getContext } from "svelte";
    import { slide } from "svelte/transition";
    import { localize } from "#runtime/svelte/helper";

    import pressedKeysStore from "../../stores/pressedKeysStore";
    import getKeyPressAsOptions from "../handlers/getKeyPressAsOptions";
    import getSummaryData from "../../utils/summaries/getSummaryData";

    import ItemActionButtons from "./ItemActionButtons.svelte";
    import ItemInnerWrapper from "./ItemInnerWrapper.svelte";
    import ItemSummary from "./itemSummaries/ItemSummary.svelte";

    export let item;
    export let action = null;
    export let actionId = null;
    export let showDescription = false;

    const actor = getContext("actor");
    const sheet = getContext("sheet");
    const { A5E } = CONFIG;

    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

    let isGM = game.user.isGM;

    function determineActionListVisibility(action, item, sheetIsLocked) {
        if (action) return false;

        if (item.actions?.count < 2) {
            return item.actions
                ?.values()
                ?.some((action) => action.uses?.value || action.uses?.max);
        }

        if (game.settings.get("a5e", "collapseActionList") && sheetIsLocked)
            return false;

        return true;
    }

    function onItemActivate() {
        const options = getKeyPressAsOptions($pressedKeysStore);
        item.activate(actionId, options);
    }

    async function onConfigure() {
        if (actionId) {
            await item.actions?.configure(actionId);
            return;
        }

        item.configureItem();
    }

    function onDragStart(event) {
        const dragData = item.toDragData();
        if (!dragData) return;

        dragData.actorId = item?.parent.id;
        dragData.actionId = actionId;

        return event.dataTransfer.setData(
            "text/plain",
            JSON.stringify(dragData),
        );
    }

    function onDropObject(event) {
        if (item?.system?.objectType === "container") {
            sheet._onDrop(event, { containerUuid: item.uuid });
            return;
        }
        sheet._onDrop(event);
    }

    async function getDescription() {
        const data =
            (await TextEditor.enrichHTML(
                actionId ? action.description : item.system.description,
                {
                    async: true,
                    secrets: item.isOwner,
                    relativeTo: item,
                    rollData: $actor?.getRollData() ?? {},
                },
            )) ?? localize("A5E.NoDescription");

        return data;
    }

    $: containerItems = (item?.containerItems?.documents ?? []).reduce(
        (acc, [k, v]) => {
            const i = fromUuidSync(v.uuid);
            if (!i) return acc;
            if (i.parent?.id !== $actor.id) return acc;

            acc.push([k, i]);
            return acc;
        },
        [],
    );

    $: description = getDescription(item)
        .then((data) => (description = data))
        .catch((err) => (description = err));

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: showActionList = determineActionListVisibility(
        action,
        item,
        sheetIsLocked,
    );

    $: summaryData = getSummaryData(item, action);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-item"
    class:a5e-item--highlight={Number(item.system.prepared ?? 0) ===
        A5E.PREPARED_STATES.PREPARED ||
        (item.system.equippedState === A5E.EQUIPPED_STATES.EQUIPPED &&
            !item.system?.containerId)}
    class:a5e-item--purple-highlight={Number(item.system.prepared ?? 0) ===
        A5E.PREPARED_STATES.ALWAYS_PREPARED}
    class:a5e-item--red-highlight={item.system.requiresBloodied}
    draggable="true"
    on:dragstart={onDragStart}
    on:drop|preventDefault|stopPropagation={(e) => onDropObject(e)}
    on:click={() => {
        showDescription = !showDescription;
    }}
    on:auxclick={() => {
        if (rightClickConfigure) onConfigure();
    }}
>
    <button
        class="a5e-item__roll-button"
        class:a5e-item__roll-button--shift={$pressedKeysStore.Shift}
        class:a5e-item__roll-button--ctrl={$pressedKeysStore.Control}
        class:disable-pointer-events={!$actor.isOwner}
        on:click|stopPropagation={({ target }) => {
            target.blur();
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

    <ItemInnerWrapper {actionId} {action} {item} />

    {#if $actor.isOwner}
        <ItemActionButtons action={actionId} {item} />
    {/if}
</li>

{#if showDescription}
    <div class="description-wrapper" transition:slide|local>
        {#if !isGM && item.type === "object" && item.system.unidentified}
            {@html item.system.unidentifiedDescription ??
                localize("A5E.NoUnidentifiedDescription")}
        {:else}
            {#if Object.values(summaryData).some(Boolean)}
                <ItemSummary {summaryData} --margin-bottom="0.375rem" />

                {#if description}
                    <hr class="a5e-rule" style="margin-block: 0.5rem;" />
                {/if}
            {/if}

            <!-- svelte-ignore missing-declaration -->
            {@html description}
        {/if}
    </div>
{/if}

{#if showActionList}
    <ul class="a5e-item-list a5e-item-list--sub-items">
        {#each item?.actions?.entries() ?? [] as [id, action] (id)}
            <svelte:self {item} {action} actionId={id} />
        {/each}
    </ul>
{/if}

{#if containerItems.length}
    <ul class="a5e-item-list a5e-item-list--sub-items">
        {#each containerItems as [id, child] (id)}
            <svelte:self item={child} />
        {/each}
    </ul>
{/if}

<style lang="scss">
    .description-wrapper {
        padding: 0.125rem 0.25rem;
    }

    .disable-pointer-events {
        pointer-events: none;
    }
</style>
