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
    <div class="input-wrapper">
        <label for="{actor.id}-{item.id}-current-uses">
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
    </div>
{/if}

<style lang="scss">
    .name-wrapper {
        display: block;
        font-size: 0.833rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex-grow: 1;
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
        gap: 0.125rem;
        align-items: center;
        justify-content: center;
        grid-area: uses;
    }
</style>
