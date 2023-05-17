<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import DeletionConfirmationDialog from "../dialogs/initializers/DeletionConfirmationDialog";

    export let item;
    export let action = null;

    async function onConfigure() {
        if (action) {
            await item.actions.configure(action);
            return;
        }

        item.configureItem();
    }

    async function onDelete() {
        let dialogData;

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
                game.settings.get("a5e", "hideDeleteConfirmation")
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

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if !sheetIsLocked}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="track" on:click|stopPropagation>
        <i class="track-icon fa-solid fa-ellipsis-vertical" />

        <ul class="track-items">
            <li>
                <button
                    class="action-button fas fa-cog"
                    data-tooltip="A5E.ButtonToolTipConfigure"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={onConfigure}
                />
            </li>

            <li>
                <button
                    class="action-button fa-solid fa-clone"
                    data-tooltip="A5E.ButtonToolTipDuplicate"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={onDuplicate}
                />
            </li>

            <li>
                <button
                    class="action-button delete-button fas fa-trash"
                    data-tooltip="A5E.ButtonToolTipDelete"
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={onDelete}
                />
            </li>
        </ul>
    </div>
{/if}

<style lang="scss">
    .action-button {
        padding: 0.25rem;
        background: none;
        border: 0;
        transition: all 0.15s ease-in-out;
        color: var(--icon-color, #999);

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: #8b2525;
    }

    .track {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        margin-inline: 0.5rem 0.5rem;
        border-radius: 50%;
        color: #999;
        grid-area: menu;

        transition: width 0.3s ease;

        &-icon {
            z-index: 1;
            display: flex;
            width: 1.5rem;
            height: 1.5rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--track-border-color, #ccc);
            background: var(--track-background, #ebe9e0);
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            transform: translateX(-1px);

            transition: all 0.15s ease-in-out;
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.5rem;
            padding: 0 1rem 0 0.5rem;
            border: 1px solid var(--track-border-color, #ccc);
            border-left: 0;
            margin: 0;
            background: var(--track-background, #ebe9e0);
            border-radius: 0.75rem 0 0 0.75rem;
            list-style: none;
            opacity: 0;
            transform: translateX(calc(-100% - 1rem));

            transition: all 0.15s ease-in-out;
        }

        &:hover {
            overflow: initial;

            .track-items {
                display: flex;
                opacity: 1;
            }

            .track-icon {
                color: #555;
            }
        }
    }
</style>
