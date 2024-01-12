<script lang="ts">
    import type { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
    import type { Grant } from "../../../../types/grants";

    import { getContext } from "svelte";

    export let grant: Grant;
    const item: TJSDocument = getContext("item");

    function onGrantActivate() {}

    function onDragStart() {}

    async function onAuxClick() {
        if (!rightClickConfigure) return;
        grant.configureGrant();
    }

    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

    $: sheetIsLocked = !$item.isOwner ? true : false;
</script>

<li
    class="a5e-item a5e-item--grant"
    draggable="true"
    on:dragstart={onDragStart}
    on:auxclick|preventDefault={onAuxClick}
>
    <button
        class="grant-activate-button"
        class:disable-pointer-events={!$item.isOwner}
        disabled={true}
        on:click|stopPropagation={({ target }) => {
            onGrantActivate();
        }}
    >
        <img
            class="grant-image"
            src={grant?.img || $item?.img || "icons/svg/upgrade.svg"}
            alt={grant.label || "New Grant"}
        />
    </button>

    <div class="name-wrapper">
        <div class="name">{grant.label || "New Grant"}</div>
    </div>

    <div class="indicator-wrapper">
        <!-- TODO: Optional and level indicators go here -->
    </div>

    {#if $item.isOwner}
        {#if !sheetIsLocked}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="track" on:click|stopPropagation>
                <i class="track-icon fa-solid fa-ellipsis-vertical" />

                <ul class="track-items">
                    <li>
                        <button
                            class="action-button fas fa-cog"
                            data-tooltip="A5E.ButtonToolTipConfigure"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={() =>
                                grant.configureGrant()}
                        />
                    </li>

                    <li>
                        <button
                            class="action-button fa-solid fa-clone"
                            data-tooltip="A5E.ButtonToolTipDuplicate"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={() =>
                                grant?.duplicateGrant()}
                        />
                    </li>

                    <li>
                        <button
                            class="action-button delete-button fas fa-trash"
                            data-tooltip="A5E.ButtonToolTipDelete"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={() => grant.deleteGrant()}
                        />
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

    .grant-activate-button {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: $border-radius-standard;
        grid-area: icon;

        &:hover {
            box-shadow: none;
        }
    }

    .grant-image {
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
        font-size: $font-size-sm;
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
        border-radius: $border-radius-standard;
        font-size: $font-size-sm;
        color: #808080;
    }

    .grant-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0;
        margin: 0;
        background: none;
        color: #999;
        border: 0;
        font-size: $font-size-lg;
        transition: $standard-transition;

        &--active-toggle {
            font-size: $font-size-xl;
        }

        &:hover {
            color: $color-primary;
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .active {
        color: $color-primary;
    }

    .locked {
        cursor: not-allowed;

        &:hover {
            color: #999;
        }
    }

    .action-button {
        padding: 0.25rem;
        color: #999;
        border: 0;
        background: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

        transition: $standard-transition;

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
        color: $color-secondary;
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
            border: 1px solid #ccc;
            background: #ebe9e0;
            border-radius: 50%;
            cursor: pointer;
            font-size: $font-size-md;
            transform: translateX(-1px);

            transition: $standard-transition;
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.5rem;
            padding: 0 1rem 0 0.5rem;
            border: 1px solid #ccc;
            border-left: 0;
            margin: 0;
            background: #ebe9e0;
            border-radius: 0.75rem 0 0 0.75rem;
            list-style: none;
            opacity: 0;
            transform: translateX(calc(-100% - 1rem));

            transition: $standard-transition;
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
