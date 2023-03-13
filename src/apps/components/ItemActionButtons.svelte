<script>
    import { getContext } from "svelte";

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

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="action-buttons">
    {#if !action && item?.system?.favorite !== undefined}
        <button
            class="action-button fas fa-star"
            class:active={item.system.favorite}
            data-tooltip="A5E.ButtonToolTipFavorite"
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.toggleFavorite()}
        />
    {/if}

    {#if !action && item.type === "object"}
        <button
            class="action-button fas fa-shield-alt"
            class:active={item.system.equipped}
            data-tooltip={item.system.equipped
                ? "A5E.ButtonToolTipUnequip"
                : "A5E.ButtonToolTipEquip"}
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.toggleEquipped()}
        />

        <button
            class="action-button fas fa-heart-crack"
            class:active={item.system.broken}
            data-tooltip="A5E.ButtonToolTipToggleBroken"
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.toggleBroken()}
        />
    {/if}

    {#if !action && item.type === "spell"}
        <button
            class="action-button fas fa-book"
            class:active={item.system.prepared}
            data-tooltip={item.system.prepared
                ? "A5E.ButtonToolTipUnprepare"
                : "A5E.ButtonToolTipPrepare"}
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.togglePrepared()}
        />
    {/if}

    {#if !sheetIsLocked}
        <button
            class="action-button fas fa-cog"
            data-tooltip="A5E.ButtonToolTipConfigure"
            data-tooltip-direction="UP"
            on:click|stopPropagation={onConfigure}
        />

        <button
            class="action-button fa-solid fa-clone"
            data-tooltip="A5E.ButtonToolTipDuplicate"
            data-tooltip-direction="UP"
            on:click|stopPropagation={onDuplicate}
        />

        <button
            class="action-button delete-button fas fa-trash"
            data-tooltip="A5E.ButtonToolTipDelete"
            data-tooltip-direction="UP"
            on:click|stopPropagation={onDelete}
        />
    {/if}
</div>

<style lang="scss">
    .action-buttons {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: auto;
        color: #999;
    }

    .action-button {
        padding: 0.25rem;
        background: none;
        border: 0;
        transition: all 0.15s ease-in-out;
        color: #999;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .active {
        color: #425f65;

        &:hover {
            color: #425f65;
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: #8b2525;
    }
</style>
