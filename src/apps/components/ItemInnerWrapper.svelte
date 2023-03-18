<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let item;
    export let action;
    export let actionId;

    const actor = getContext("actor");

    function updateField(event) {
        event.preventDefault();

        const { target } = event;
        updateDocumentDataFromField(item, target.name, Number(target.value));
    }

    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="name-wrapper">
    {action?.name ?? item.name}
</div>

{#if !action}
    <div class="button-wrapper">
        {#if item?.system?.favorite !== undefined}
            <button
                class="action-button fas fa-star"
                class:active={item.system.favorite}
                data-tooltip="A5E.ButtonToolTipFavorite"
                data-tooltip-direction="UP"
                on:click|stopPropagation={() => item.toggleFavorite()}
            />
        {/if}

        {#if item.type === "object"}
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

        {#if item.type === "spell"}
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
    </div>
{/if}

{#if !actionId && item?.type === "object"}
    <label class="quantity-label" for="{actor.id}-{item.id}-quantity">
        {localize("A5E.ItemQuantity")}
    </label>

    <input
        class="number-input number-input--quantity"
        id="{actor.id}-{item.id}-quantity"
        type="number"
        name="system.quantity"
        value={item.system.quantity}
        min="0"
        on:click|stopPropagation
        on:change={updateField}
    />
{/if}

{#if !actionId && item.system.uses?.max}
    <label class="uses-label" for="{actor.id}-{item.id}-current-uses">
        {localize("A5E.Uses")}
    </label>

    <div class="uses-wrapper">
        <input
            class="number-input"
            id="{actor.id}-{item.id}-current-uses"
            type="number"
            name="system.uses.value"
            value={item.system.uses.value}
            on:click|stopPropagation
            on:change={updateField}
        />

        <span> / </span>

        <input
            class="number-input"
            type="number"
            name="system.uses.max"
            value={item.system.uses.max}
            disabled={sheetIsLocked}
            on:click|stopPropagation
            on:change={updateField}
        />
    </div>
{/if}

<style lang="scss">
    .action-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0.125rem 0.25rem;
        background: none;
        color: #999;
        border: 0;

        transition: all 0.15s ease-in-out;

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

    .button-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        grid-area: indicators;
        margin-left: -0.25rem;
    }

    .name-wrapper {
        display: block;
        font-size: 0.833rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        grid-area: name;
    }

    .number-input {
        background: transparent;
        border: 1px solid #bbb;
        height: 1.125rem;
        width: 7ch;

        &--quantity {
            grid-area: quantity;
        }
    }

    .quantity-label {
        grid-area: quantityLabel;
    }

    .uses-label {
        grid-area: usesLabel;
    }

    .number-input,
    .quantity-label,
    .uses-label {
        font-size: 0.694rem;
        text-align: center;
    }

    .uses-wrapper {
        display: flex;
        gap: 0.25rem;
        align-items: center;
        justify-content: center;
        grid-area: uses;
    }
</style>
