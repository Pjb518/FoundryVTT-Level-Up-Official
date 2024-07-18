<script>
    import { getContext } from "svelte";

    import ImportButton from "../ImportButton.svelte";

    import getDocumentSourceTooltip from "../../../utils/getDocumentSourceTooltip";
    import CompendiumDeleteButton from "../CompendiumDeleteButton.svelte";

    export let document;

    function onDragStart(event) {
        const data = {
            type: collection.documentName,
            uuid: collection.getUuid(document._id),
        };
        return event.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    function getOriginSource(originItem) {
        if (typeof originItem.system.source !== "string") return null;

        const source = products[originItem.system.source];

        return source || null;
    }

    const collection = getContext("collection");
    const { products } = CONFIG.A5E;

    $: originSource = getOriginSource(document);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-item a5e-item--compendium-spell-document"
    draggable="true"
    on:click={async () => {
        const doc =
            collection.get(document._id) ?? (await collection.getDocument(document._id));
        doc.sheet?.render(true);
    }}
    on:dragstart={onDragStart}
>
    <img
        class="a5e-item__image a5e-item__image--compendium-document"
        src={document.img}
        alt={document.name}
    />

    <h3 class="a5e-item__name a5e-item__name--compendium-document">
        {document.name}
    </h3>

    <span class="a5e-item__details">
        {#if originSource?.abbreviation}
            <a
                class="a5e-item__source-tag"
                href={originSource?.url}
                target="_blank"
                data-tooltip={getDocumentSourceTooltip(originSource)}
                data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source"
                on:click|stopPropagation
            >
                {originSource?.abbreviation}
            </a>
        {/if}
    </span>

    <ImportButton {document} />

    {#if !collection.locked}
        <CompendiumDeleteButton {document} />
    {/if}
</li>
