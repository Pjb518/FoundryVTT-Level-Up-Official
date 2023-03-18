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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="track" data-tooltip-direction="DOWN" on:click|stopPropagation>
    <i class="track-icon fa-solid fa-ellipsis-vertical" />

    <ul class="track-items">
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
            {#if item.system.requiresAttunement}
                <li>
                    <button
                        class="action-button fa-solid fa-link"
                        class:active={item.system.attuned}
                        data-tooltip={item.system.attuned
                            ? localize("A5E.ButtonToolTipBreakAttunement", {
                                  item: item.name,
                              })
                            : localize("A5E.ButtonToolTipAttune", {
                                  item: item.name,
                              })}
                        data-tooltip-direction="UP"
                        on:click|stopPropagation={() => item.toggleAttunement()}
                    />
                </li>
            {/if}

            <li>
                <button
                    class="action-button fas fa-shield-alt"
                    class:active={item.system.equipped}
                    data-tooltip={item.system.equipped
                        ? "A5E.ButtonToolTipUnequip"
                        : "A5E.ButtonToolTipEquip"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleEquipped()}
                />
            </li>

            <li>
                <button
                    class="action-button fas fa-heart-crack"
                    class:active={item.system.broken}
                    data-tooltip={item.system.broken
                        ? "A5E.ButtonToolTipFixBroken"
                        : "A5E.ButtonToolTipBroken"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.toggleBroken()}
                />
            </li>
        {/if}

        {#if !action && item.type === "spell"}
            <li>
                <button
                    class="action-button fas fa-book"
                    class:active={item.system.prepared}
                    data-tooltip={item.system.prepared
                        ? "A5E.ButtonToolTipUnprepare"
                        : "A5E.ButtonToolTipPrepare"}
                    data-tooltip-direction="UP"
                    on:click|stopPropagation={() => item.togglePrepared()}
                />
            </li>
        {/if}

        {#if !sheetIsLocked}
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
        {/if}
    </ul>
</div>

<style lang="scss">
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

    .track {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 1.75rem;
        height: 1.75rem;
        margin-inline: 2rem 0.5rem;
        border-radius: 50%;
        color: #999;
        grid-area: actionButtons;

        transition: width 0.3s ease;

        &-icon {
            z-index: 1;
            display: flex;
            width: 1.75rem;
            height: 1.75rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            background: #ebe9e0;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            transform: translateX(-1px);

            transition: all 0.15s ease-in-out;
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.75rem;
            padding: 0 1.25rem 0 0.75rem;
            border: 1px solid #ccc;
            border-left: 0;
            margin: 0;
            background: #ebe9e0;
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
