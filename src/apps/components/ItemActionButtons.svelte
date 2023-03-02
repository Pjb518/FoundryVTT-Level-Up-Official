<script>
    import { getContext } from "svelte";

    import DeletionConfirmationDialog from "../dialogs/initializers/DeletionConfirmationDialog";

    export let item;

    async function onDeleteItem() {
        let dialogData;

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

    const actor = getContext("actor");

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="action-buttons">
    {#if item?.system?.favorite !== undefined}
        <button
            class="action-button fas fa-star"
            class:active={item.system.favorite}
            class:locked={sheetIsLocked}
            disabled={sheetIsLocked}
            data-tooltip="A5E.ButtonToolTipFavorite"
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.toggleFavorite()}
        />
    {/if}

    {#if item.type === "object"}
        <button
            class="action-button fas fa-shield-alt"
            class:active={item.system.equipped}
            class:locked={sheetIsLocked}
            disabled={sheetIsLocked}
            data-tooltip={item.system.equipped
                ? "A5E.ButtonToolTipUnequip"
                : "A5E.ButtonToolTipEquip"}
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.toggleEquipped()}
        />

        <button
            class="action-button fas fa-heart-crack"
            class:active={item.system.broken}
            class:locked={sheetIsLocked}
            data-tooltip={item.system.broken
                ? "A5E.ButtonToolTipFixBroken"
                : "A5E.ButtonToolTipBroken"}
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.toggleBroken()}
        />
    {/if}

    {#if item.type === "spell"}
        <button
            class="action-button fas fa-book"
            class:active={item.system.prepared}
            class:locked={sheetIsLocked}
            disabled={sheetIsLocked}
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
            on:click|stopPropagation={() => item.configureItem()}
        />

        <button
            class="action-button fa-solid fa-clone"
            data-tooltip="A5E.ButtonToolTipDuplicate"
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => item.duplicateItem()}
        />

        <button
            class="action-button delete-button fas fa-trash"
            data-tooltip="A5E.ButtonToolTipDelete"
            data-tooltip-direction="UP"
            on:click|stopPropagation={() => onDeleteItem()}
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

    .locked {
        pointer-events: none;
    }

    .delete-button:hover {
        color: #8b2525;
    }
</style>
