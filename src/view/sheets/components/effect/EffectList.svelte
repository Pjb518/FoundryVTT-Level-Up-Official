<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import { DeletionConfirmationDialog } from "#view/dialogs/initializers/DeletionConfirmationDialog.svelte.ts";

    type Props = {
        effect: ActiveEffect;
    };

    let { effect }: Props = $props();

    function onEffectActivate() {}

    function onConfigure() {
        effect.sheet?.render(true);
    }

    function onDuplicate() {
        effect.duplicateEffect(actionId);
    }

    async function onDelete() {
        let dialogData: any;

        if (!game.settings.get("a5e", "hideDeleteConfirmation")) {
            const itemDocument = { name: effect.name, type: "Active Effect" };
            const dialog = new DeletionConfirmationDialog(itemDocument);
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

        const effectId = effect.id;
        effect.delete();

        // Remove Prompt config
        if (!actionId || doc.documentName !== "Item") return;

        const action = doc.actions.get(actionId);
        const updatedEffects = [...action.effects].filter(
            (id) => id !== effectId,
        );

        doc.update({
            [`system.actions.${actionId}.effects`]: updatedEffects,
        });
    }

    function onDragStart(event) {
        const dragData = effect.toDragData();
        if (!dragData) return;

        dragData.parentId = effect?.parent?.id;

        return event.dataTransfer.setData(
            "text/plain",
            JSON.stringify(dragData),
        );
    }

    const doc: any = getContext("item") ?? getContext("actor");
    const actionId =
        (getContext("actionId") as string | undefined) ?? undefined;
    let sheetIsLocked: () => boolean =
        getContext("sheetIsLocked") ??
        (() => {
            return false;
        });

    let rightClickConfigure =
        (game.settings.get("a5e", "itemRightClickConfigure") as boolean) ??
        false;

    let allowTransfer = $derived(
        effect.system.effectType === "passive" &&
            doc.documentName === "Item" &&
            ["Actor", "ActorDelta"].includes(doc.parent?.documentName),
    );
</script>

<li
    class="a5e-item a5e-item--effect"
    draggable="true"
    ondragstart={onDragStart}
    onauxclick={(e) => {
        e.preventDefault();
        if (rightClickConfigure) onConfigure();
    }}
>
    <button
        class="effect-activate-button"
        class:disable-pointer-events={!doc.isOwner}
        disabled={true}
        onclick={(e) => {
            e.stopPropagation();
            e.currentTarget.blur();
            onEffectActivate();
        }}
    >
        <img
            class="effect-image"
            src={effect?.img ?? doc.img ?? "icons/svg/aura.svg"}
            alt={effect?.name ?? localize("A5E.effects.new")}
        />
    </button>

    <div class="name-wrapper">
        <div class="name">
            {effect.name}
        </div>
    </div>

    <div class="indicator-wrapper">
        {#if effect.isTemporary}
            <div class="component-wrapper">
                <div
                    class="component"
                    data-tooltip="A5E.effects.types.singular.temporary"
                    data-tooltip-direction="UP"
                >
                    <i class="icon fa-solid fa-hourglass-half"></i>
                </div>
            </div>
        {/if}

        <div class="button-wrapper">
            {#if allowTransfer}
                <button
                    class="a5e-button a5e-button--transparent effect-button"
                    data-tooltip="A5E.effects.applyToActor"
                    data-tooltip-direction="UP"
                    aria-label="A5E.effects.applyToActor"
                    onclick={() => effect.transferEffect(doc.parent)}
                >
                    <i class="fa-solid fa-circle-down"></i>
                </button>
            {/if}

            {#if doc.documentName === "Actor"}
                <button
                    class="a5e-button a5e-button--transparent effect-button effect-button--active-toggle"
                    data-tooltip={effect.isLocked
                        ? "Originating item is not equipped."
                        : "A5E.effects.toggleActiveState"}
                    data-tooltip-direction="UP"
                    aria-label="Toggle Active State"
                    onclick={() => effect.toggleActiveState()}
                >
                    <i
                        class="fa-solid fa-circle-down"
                        class:fa-toggle-off={effect.isSuppressed}
                        class:fa-toggle-on={!effect.isSuppressed}
                        class:active={!effect.isSuppressed}
                        class:locked={effect.isLocked}
                    ></i>
                </button>
            {/if}
        </div>
    </div>

    <!-- Summary -->

    {#if doc.isOwner}
        {#if !sheetIsLocked()}
            <div class="track">
                <i class="track-icon icon fa-solid fa-ellipsis-vertical"></i>

                <ul class="track-items">
                    <li>
                        <button
                            class="action-button icon fas fa-cog"
                            data-tooltip="A5E.ButtonToolTipConfigure"
                            data-tooltip-direction="UP"
                            aria-label="A5E.ButtonToolTipConfigure"
                            onclick={onConfigure}
                        ></button>
                    </li>

                    <li>
                        <button
                            class="action-button icon fa-solid fa-clone"
                            data-tooltip="A5E.ButtonToolTipDuplicate"
                            data-tooltip-direction="UP"
                            aria-label="A5E.ButtonToolTipDuplicate"
                            onclick={onDuplicate}
                        ></button>
                    </li>

                    <li>
                        <button
                            class="action-button delete-button icon fas fa-trash"
                            data-tooltip="A5E.ButtonToolTipDelete"
                            data-tooltip-direction="UP"
                            aria-label="A5E.ButtonToolTipDelete"
                            onclick={onDelete}
                        ></button>
                    </li>
                </ul>
            </div>
        {/if}
    {/if}
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .effect-activate-button {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: var(--a5e-border-radius-standard);
        grid-area: icon;

        &:hover {
            box-shadow: none;
        }
    }

    .effect-image {
        display: block;
        height: 100%;
        width: auto;
    }

    .name-wrapper {
        display: flex;
        align-items: center;
        flex-grow: 0;
        gap: 0.5rem;
        overflow: hidden;
        grid-area: name;
    }

    .name {
        font-size: var(--a5e-sm-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .indicator-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-inline: 0.25rem;
        grid-area: indicators;
    }

    .button-wrapper,
    .component-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-inline: 0.5rem 0.375rem;
    }

    .button-wrapper {
        margin-inline: 0.25rem;
        gap: 0.5rem;
    }

    .component-wrapper {
        gap: 0.5rem;
    }

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: var(--a5e-border-radius-standard);
        font-size: var(--a5e-sm-text);
        color: #808080;
    }

    .effect-button {
        width: fit-content;
        padding: 0;
        margin: 0;
        color: var(--a5e-button-gray);
        border: 0;
        font-size: var(--a5e-lg-text);
        transition: var(--a5e-transition-standard);

        &--active-toggle {
        }

        &:hover {
            color: var(--a5e-color-primary);
        }

        &:hover,
        &:focus {
            transform: scale(1);
            box-shadow: none;
        }
    }

    .active {
        color: var(--a5e-button-primary);
    }

    .locked {
        cursor: not-allowed;

        &:hover {
            color: var(--a5e-button-gray);
        }
    }

    .action-button {
        padding: 0.25rem;
        color: var(--a5e-button-gray);
        border: 0;
        background: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

        transition: var(--a5e-transition-standard);

        &:hover {
            color: var(--a5e-button-gray-hover);
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
        width: 1.5rem;
        height: 1.5rem;
        margin-inline: 0.5rem 0.5rem;
        border-radius: 50%;
        color: var(--a5e-track-color);
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
            border: 1px solid var(--a5e-track-icon-border);
            background: var(--a5e-track-icon-background);
            border-radius: 50%;
            cursor: pointer;
            font-size: var(--a5e-md-text);
            transform: translateX(-1px);

            transition: var(--a5e-transition-standard);
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.5rem;
            padding: 0 1rem 0 0.5rem;
            border: 1px solid var(--a5e-track-icon-border);
            border-left: 0;
            margin: 0;
            background: var(--a5e-track-icon-background);
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
                color: var(--a5e-track-color-hover);
            }
        }
    }
</style>
