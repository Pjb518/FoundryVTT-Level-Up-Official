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

    function getFeatureDetailsLabel(feature) {
        const parentClass = feature.system.classes;

        const featureProperties = [
            classes[parentClass] ?? classes5e[parentClass],
        ];

        if (feature.system.featureType === "knack") {
            featureProperties.push(knackTypes[parentClass]);
        }

        return featureProperties.filter(Boolean).join(" | ");
    }

    function getFeatureSource(feature) {
        if (typeof feature.system.source !== "string") return null;

        const source = products[feature.system.source];

        return source || null;
    }

    function getPrerequisiteTooltipContent(prerequisite) {
        return `<b>Prerequisites:</b> ${prerequisite}`;
    }

    const collection = getContext("collection");
    const { classes, classes5e, knackTypes, products } = CONFIG.A5E;

    $: featureDetails = getFeatureDetailsLabel(document);
    $: featureSource = getFeatureSource(document);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<li
    class="a5e-item a5e-item--compendium-spell-document"
    draggable="true"
    on:click={async () => {
        const doc =
            collection.get(document._id) ??
            (await collection.getDocument(document._id));
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

        {#if document.system.prerequisite}
            <i
                class="a5e-item__icon icon fa-solid fa-key"
                data-tooltip={getPrerequisiteTooltipContent(
                    document.system.prerequisite,
                )}
                data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--basic"
                data-tooltip-direction="DOWN"
            />
        {/if}
    </h3>

    <span class="a5e-item__details">
        {#if featureSource?.abbreviation}
            <a
                class="a5e-item__source-tag"
                href={featureSource?.url}
                target="_blank"
                data-tooltip={getDocumentSourceTooltip(featureSource)}
                data-tooltip-class="a5e-tooltip a5e-tooltip--dark a5e-tooltip--document-source"
                on:click|stopPropagation
            >
                {featureSource?.abbreviation}
            </a>
        {/if}

        {featureDetails}
    </span>

    <ImportButton {document} />

    {#if !collection.locked}
        <CompendiumDeleteButton {document} />
    {/if}
</li>
