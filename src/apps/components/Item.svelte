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
            JSON.stringify(dragData)
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
                }
            )) ?? localize("A5E.NoDescription");

        return data;
    }

    $: containerItems = Object.entries(
        item?.containerItems?.documents ?? {}
    ).reduce((acc, [k, v]) => {
        const i = fromUuidSync(v.uuid);
        if (!i) return acc;
        if (i.parent?.id !== $actor.id) return acc;

        acc.push([k, i]);
        return acc;
    }, []);

    $: description = getDescription(item)
        .then((data) => (description = data))
        .catch((err) => (description = err));

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;

    $: showActionList = determineActionListVisibility(
        action,
        item,
        sheetIsLocked
    );

    $: summaryData = getSummaryData(item, action);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<li
    class="item-wrapper"
    class:item-wrapper--highlight={Number(item.system.prepared ?? 0) ===
        A5E.PREPARED_STATES.PREPARED ||
        (item.system.equippedState === A5E.EQUIPPED_STATES.EQUIPPED &&
            !item.system?.containerId)}
    class:item-wrapper--purple-highlight={Number(item.system.prepared ?? 0) ===
        A5E.PREPARED_STATES.ALWAYS_PREPARED}
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
    <ul class="actions-list">
        {#each item?.actions?.entries() ?? [] as [id, action] (id)}
            <svelte:self {item} {action} actionId={id} />
        {/each}
    </ul>
{/if}

{#if containerItems.length}
    <ul class="actions-list">
        {#each containerItems as [id, child] (id)}
            <svelte:self item={child} />
        {/each}
    </ul>
{/if}

<style lang="scss">
    .actions-list {
        display: flex;
        flex-direction: column;
        gap: 0.175rem;
        margin: 0;
        padding: 0 0 0 1rem;
    }

    .description-wrapper {
        padding: 0.125rem 0.25rem;
    }

    .disable-pointer-events {
        pointer-events: none;
    }

    .item-wrapper {
        position: relative;
        display: grid;
        grid-template-areas: var(--itemTemplateAreas);
        grid-template-columns: var(--itemTemplateColumns);
        column-gap: 0.5rem;
        row-gap: 0;
        align-items: center;
        width: 100%;
        padding: 0.125rem;
        padding-right: 0.5rem;
        border: 1px solid #ccc;
        border-radius: $border-radius-standard;
        background: var(--item-background, rgba(0, 0, 0, 0.05));
        cursor: pointer;

        &--highlight {
            --icon-color: hsla(145, 100%, 15%, 0.302);
            --icon-color-active: hsla(145, 100%, 15%, 0.75);
            --indicator-background: hsla(145, 100%, 32%, 0.302);
            --indicator-text-color: black;
            --input-border-color: hsla(145, 100%, 15%, 0.302);
            --item-background: hsla(145, 100%, 42%, 0.302);
            --track-background: hsl(120, 43%, 87%);
            --track-border-color: hsla(145, 100%, 25%, 0.302);
        }

        &--purple-highlight {
            --icon-color: hsla(260, 50%, 40%, 0.302);
            --icon-color-active: hsla(280, 35%, 30%, 0.75);
            --indicator-background: hsla(280, 55%, 50%, 0.302);
            --indicator-text-color: black;
            --input-border-color: hsla(280, 75%, 60%, 0.302);
            --item-background: hsla(280, 75%, 60%, 0.22);
            --track-background: hsl(280, 30%, 90%);
            --track-border-color: hsla(280, 30%, 40%, 0.302);
        }
    }

    .item-image {
        display: block;
        height: 100%;
        width: auto;
        object-fit: cover;

        &--die {
            display: none;
            padding: 0;
            margin: 0;
        }
    }

    .item-roll-button {
        width: 1.375rem;
        height: 1.375rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: $border-radius-standard;
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
            filter: brightness(0) saturate(100%) invert(58%) sepia(10%)
                saturate(2832%) hue-rotate(73deg) brightness(88%) contrast(76%);

            // filter: invert(34%) sepia(4%) saturate(4360%) hue-rotate(143deg)
            //     brightness(78%) contrast(65%);
        }

        &--ctrl:hover {
            filter: brightness(0) saturate(100%) invert(18%) sepia(80%)
                saturate(5142%) hue-rotate(348deg) brightness(74%) contrast(94%);

            // filter: invert(15%) sepia(27%) saturate(4731%) hue-rotate(338deg)
            //     brightness(101%) contrast(95%);
        }
    }
</style>
