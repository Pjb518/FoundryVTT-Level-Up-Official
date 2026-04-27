<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Section from "#view/snippets/Section.svelte";
    import DropArea from "#view/snippets/DropArea.svelte";

    async function addFeature(path: string, uuid: string) {
        const feature = fromUuidSync(uuid);
        if (!feature) return;

        if (feature.type !== "feature") {
            return ui.notifications.error(
                "Invalid Document - Must be a Feature",
            );
        }

        await item.update({ [`system.${path}`]: uuid });
    }

    async function deleteFeature(path: string) {
        await item.update({ [`system.${path}`]: "" });
    }

    let item = getContext("item") as any;

    let source = $derived(item.reactive.system.sourceOfInspiration || null);
    let inspiration = $derived(item.reactive.system.inspirationFeature || null);
    let fulfillment = $derived(item.reactive.system.fulfillmentFeature || null);
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section
        heading="A5E.details.destiny.featureSource"
        --a5e-section-body-gap="0.75rem"
    >
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(data) =>
                addFeature("sourceOfInspiration", data.uuid)}
        ></DropArea>

        {#if source}
            {@const sourceItem: any = fromUuidSync(source)}
            <div class="a5e-feature">
                <img
                    class="a5e-feature__img"
                    src={sourceItem?.img}
                    alt={sourceItem?.name}
                />
                <span class="a5e-feature__name">
                    {sourceItem?.name || "Incorrect Link"}
                </span>

                <button
                    class="a5e-button a5e-button--transparent"
                    aria-label="Delete Feature"
                    onclick={() => deleteFeature("sourceOfInspiration")}
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        {/if}
    </Section>

    <Section
        heading="A5E.details.destiny.featureInspiration"
        --a5e-section-body-gap="0.75rem"
    >
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(data) =>
                addFeature("featureInspiration", data.uuid)}
        ></DropArea>

        {#if inspiration}
            {@const inspirationItem: any = fromUuidSync(inspiration)}
            <div class="a5e-feature">
                <img
                    class="a5e-feature__img"
                    src={inspirationItem?.img}
                    alt={inspirationItem?.name}
                />
                <span class="a5e-feature__name">
                    {inspirationItem?.name || "Incorrect Link"}
                </span>

                <button
                    class="a5e-button a5e-button--transparent"
                    aria-label="Delete Feature"
                    onclick={() => deleteFeature("featureInspiration")}
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        {/if}
    </Section>

    <Section
        heading="A5E.details.destiny.featureFulfillment"
        --a5e-section-body-gap="0.75rem"
    >
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(data) =>
                addFeature("fulfillmentFeature", data.uuid)}
        ></DropArea>

        {#if fulfillment}
            {@const fulfillmentItem: any = fromUuidSync(fulfillment)}
            <div class="a5e-feature">
                <img
                    class="a5e-feature__img"
                    src={fulfillmentItem?.img}
                    alt={fulfillmentItem?.name}
                />
                <span class="a5e-feature__name">
                    {fulfillmentItem?.name || "Incorrect Link"}
                </span>

                <button
                    class="a5e-button a5e-button--transparent"
                    aria-label="Delete Feature"
                    onclick={() => deleteFeature("fulfillmentFeature")}
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        {/if}
    </Section>
</article>

<style lang="scss">
    .a5e-feature {
        display: grid;
        width: 100%;
        grid-template-columns: max-content 1fr min-content;
        background-color: var(--a5e-background-box);
        align-items: center;
        gap: 0.5rem;
        padding-inline: 0.5rem;
        padding-block: 0.25rem;

        &__img {
            width: 2rem;
            aspect-ratio: 1 / 1;
        }
    }
</style>
