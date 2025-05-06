<script lang="ts">
    import type { Action } from "#types/action.d.ts";

    import { getContext } from "svelte";
    import { DeletionConfirmationDialog } from "../../dialogs/initializers/DeletionConfirmationDialog.svelte.ts";

    type Props = {
        item: Item;
        action?: Action;
    };

    let { item, action = null } = $props();

    async function onConfigure(e: MouseEvent) {
        e.stopPropagation();
        if (action) {
            await item.actions.configure(action);
            return;
        }

        item.configureItem();
    }

    async function onDelete() {
        let dialogData: any;

        if (action) {
            await item.actions.remove(action);
            return;
        }

        if (!game.settings.get("a5e", "hideDeleteConfirmation")) {
            const dialog = new DeletionConfirmationDialog(item);
            await dialog.render(true);
            dialogData = await dialog.promise;

            if (!dialogData || !dialogData.confirmDeletion) return;
        }

        await game.settings.set(
            "a5e",
            "hideDeleteConfirmation",
            dialogData?.hideDeleteConfirmation ??
                game.settings.get("a5e", "hideDeleteConfirmation"),
        );

        item.delete();
    }

    async function onDuplicate() {
        if (action) {
            await item.actions.duplicate(action);
            return;
        }

        item.duplicateItem();
    }

    function showDescription(e: MouseEvent) {
        e.stopPropagation();
        item.shareItemDescription(item.actions.get(action));
    }

    const actor = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
</script>

{#if sheetIsLocked()}
    <div class="track">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <i
            onclick={showDescription}
            class="track-icon track-icon--description-button icon fa-regular fa-file-lines"
            data-tooltip={`Share ${action ? "Action" : "Item"} Description`}
            data-tooltip-direction="UP"
        ></i>
    </div>
{/if}

{#if !sheetIsLocked()}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="track" onclick={(e) => e.stopPropagation()}>
        <i class="track-icon icon fa-solid fa-ellipsis-vertical"></i>

        <ul class="track-items">
            <li>
                <button
                    class="action-button icon fas fa-cog"
                    data-tooltip="A5E.ButtonToolTipConfigure"
                    data-tooltip-direction="UP"
                    aria-label="Configure"
                    onclick={onConfigure}
                ></button>
            </li>

            <li>
                <button
                    class="action-button icon fa-solid fa-clone"
                    data-tooltip="A5E.ButtonToolTipDuplicate"
                    data-tooltip-direction="UP"
                    aria-label="Duplicate"
                    onclick={onDuplicate}
                ></button>
            </li>

            <li>
                <button
                    class="action-button delete-button icon fas fa-trash"
                    data-tooltip="A5E.ButtonToolTipDelete"
                    data-tooltip-direction="UP"
                    aria-label="Delete"
                    onclick={onDelete}
                ></button>
            </li>
        </ul>
    </div>
{/if}

<style lang="scss">
    .action-button {
        padding: 0.25rem;
        color: var(--icon-color, #999);
        border: 0;
        background: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

        transition: var(--a5e-transition-standard);

        &:hover {
            color: var(--icon-color-active, #555);
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: var(--a5e-color-error);
    }

    .track {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 1.375rem;
        height: 1.375rem;
        margin-inline: 0.5rem 0.5rem;
        border-radius: 50%;
        color: #999;
        grid-area: menu;

        transition: width 0.3s ease;

        &-icon {
            z-index: 1;
            display: flex;
            width: 1.375rem;
            height: 1.375rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            font-size: var(--a5e-sm-text);
            color: var(--icon-color, inherit);
            border: 1px solid var(--track-border-color, #ccc);
            background: var(--track-background, #ebe9e0);
            border-radius: 50%;
            cursor: pointer;
            transform: translateX(-1px);
            transition: var(--a5e-transition-standard);

            &--description-button {
                font-size: var(--a5e-sm-text);
            }
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.375rem;
            padding: 0 1rem 0 0.5rem;
            border: 1px solid var(--track-border-color, #ccc);
            border-left: 0;
            margin: 0;
            background: var(--track-background, #ebe9e0);
            border-radius: 0.75rem 0 0 0.75rem;
            list-style: none;
            opacity: 0;
            transform: translateX(calc(-100% - 1rem));

            transition: var(--a5e-transition-standard);
        }

        &:hover {
            overflow: initial;

            .track-items {
                display: flex;
                opacity: 1;
            }

            .track-icon {
                color: var(--icon-color-active, #555);
            }
        }
    }
</style>
