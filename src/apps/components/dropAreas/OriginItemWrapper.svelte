<script>
    import { createEventDispatcher, getContext } from "svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let doc;
    export let uuid;
    export let attribute = null;
    export let topLevelAttribute = null;

    const originItem = getContext("item");
    const dispatch = createEventDispatcher();

    const showQuantity = ["equipment", "items"].includes(attribute);
    const actorParent = $originItem?.parent?.documentName === "Actor" ?? false;

    let docId = $originItem
        ? topLevelAttribute
            ? $originItem[topLevelAttribute]?.getIdByUuid(uuid)
            : $originItem[attribute]?.getIdByUuid(uuid)
        : null;

    let docData = $originItem
        ? topLevelAttribute
            ? $originItem[topLevelAttribute]?.get(docId)
            : $originItem[attribute]?.getUuid(uuid)
        : null;

    let originalQuantity = doc?.type === "object" ? doc?.system?.quantity : 1;
</script>

<li class="document-wrapper">
    <img class="document-image" src={doc.img} alt={doc.name} title={doc.name} />

    <h3>{doc?.name}</h3>

    {#if docData && showQuantity && !actorParent}
        <div class="quantity-wrapper">
            <input
                class="number-input"
                id="{uuid}-quantityOverride"
                type="number"
                value={$originItem.system?.[attribute]?.[docId]
                    ?.quantityOverride || originalQuantity}
                min="1"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $originItem,
                        `system.${attribute}.${docId}.quantityOverride`,
                        parseInt(target.value),
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
        font-size: $font-size-sm;
        background: $color-light-background;
        border-radius: $border-radius-standard;
        border: 1px solid #ccc;

        h3 {
            flex: 1;
            font-size: $font-size-sm;
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
        font-size: $font-size-xs;
        text-align: center;

        &:hover {
            border: 1px solid var(--input-border-color, #bbb);
        }
    }
</style>
