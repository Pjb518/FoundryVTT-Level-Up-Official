<script>
    import { createEventDispatcher, getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let doc;
    export let uuid;
    export let attribute = null;

    const originItem = getContext("item");
    const dispatch = createEventDispatcher();

    let docData = $originItem ? $originItem[attribute]?.getUuid(uuid) : null;
    let docId = $originItem ? $originItem[attribute]?.getIdByUuid(uuid) : null;
    let originalQuantity = doc?.type === "object" ? doc?.system?.quantity : 1;
</script>

<li class="document-wrapper">
    <img class="document-image" src={doc.img} alt={doc.name} title={doc.name} />

    <h3>{doc?.name}</h3>

    {#if docData && attribute === "equipment"}
        <div class="quantity-wrapper">
            <input
                class="number-input"
                id="{uuid}-quantity"
                type="number"
                value={$originItem.system?.[attribute]?.[docId]?.quantity ??
                    originalQuantity}
                min="1"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $originItem,
                        `system.${attribute}.${docId}.quantity`,
                        parseInt(target.value)
                    )}
            />
        </div>
    {/if}

    <button
        class="a5e-button a5e-button--delete delete-button fas fa-trash"
        data-tooltip="A5E.ButtonToolTipDelete"
        data-tooltip-direction="UP"
        on:click={(event) => dispatch("item-deleted", [event, uuid])}
    />
</li>

<style lang="scss">
    .document-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-right: 0.5rem;
        font-size: 0.833rem;
        background: $color-light-background;
        border-radius: $border-radius-standard;
        border: 1px solid #ccc;

        h3 {
            flex: 1;
            font-size: 0.833rem;
        }
    }

    .document-image {
        height: 2rem;
        width: 2rem;
        border-radius: $border-radius-standard;
    }

    .delete-button {
        margin-inline: auto 0.5rem;
        padding: 0.25rem;
    }

    .quantity-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .number-input {
        background: transparent;
        border: 1px solid var(--input-border-color, #bbb);
        height: 1.125rem;
        width: 7ch;
        font-size: 0.694rem;
        text-align: center;

        &:hover {
            border: 1px solid var(--input-border-color, #bbb);
        }
    }
</style>
