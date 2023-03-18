<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let item;
    export let action;
    export let actionId;

    const actor = getContext("actor");
    $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<div class="name-wrapper">
    {action?.name ?? item.name}
</div>

{#if !actionId && item?.type === "object"}
    <div class="input-wrapper">
        <label for="{actor.id}-{item.id}-quantity">
            {localize("A5E.ItemQuantity")}
        </label>

        <input
            class="number-input"
            id="{actor.id}-{item.id}-quantity"
            type="number"
            name="system.quantity"
            value={item.system.quantity}
            min="0"
            on:click={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value)
                )}
        />
    </div>
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
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        item,
                        target.name,
                        Number(target.value)
                    )}
            />

            <span> / </span>

            <input
                class="number-input"
                type="number"
                name="system.uses.max"
                value={item.system.uses.max}
                disabled={sheetIsLocked}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        item,
                        target.name,
                        Number(target.value)
                    )}
            />
        </div>
    </div>
{/if}

<style lang="scss">
    .name-wrapper {
        font-size: 0.833rem;
        max-width: 8rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .input-wrapper {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-size: 0.694rem;
        padding: 0.125rem;
        gap: 0.125rem;
    }

    .number-input {
        background: transparent;
        border: 1px solid #bbb;
        height: 1.25rem;
        width: 7ch;
        text-align: center;
    }

    .uses-wrapper {
        display: flex;
        gap: 0.125rem;
        align-items: center;
        justify-content: center;
    }
</style>
