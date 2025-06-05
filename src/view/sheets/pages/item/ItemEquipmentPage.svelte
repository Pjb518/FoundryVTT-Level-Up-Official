<script lang="ts">
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import DropArea from "#view/snippets/DropArea.svelte";

    async function updateEquipment({ uuid }: { uuid: string }) {
        let child: any;
        try {
            const doc = await Item.fromDropData({ uuid });
            if (item.isEmbedded) {
                child = (
                    await item.actor.createEmbeddedDocuments("Item", [doc])
                )?.[0];
            } else {
                child = doc;
            }
        } catch (err) {
            console.error(err);
            return;
        }

        if (!child || child.type !== "object") {
            ui.notifications.error("Document must be an Object.");
            return;
        }

        await item.containerItems.add(child.uuid);
        const actor =
            item?.parent?.documentName === "Actor" ? item.parent : null;

        if (!actor) return;
        if (actor.uuid !== item.parent?.uuid) return;

        await child.update({ "system.containerId": item.uuid });
    }

    async function deleteEquipment(uuid: string) {
        console.log(uuid);
        const child = await fromUuid(uuid);
        await item.containerItems.remove(uuid);

        const actor =
            item?.parent?.documentName === "Actor" ? item.parent : null;

        if (!actor || !child) return;
        if (actor.uuid !== item.parent?.uuid) return;
        await child.update({ "system.containerId": "" });
    }

    let item: any = getContext("item");
    let itemStore = $derived(item.reactive.system);

    let docs = $derived(
        Object.entries(itemStore.items ?? {})
            .map(([id, e]: any) => [
                id,
                fromUuidSync(e.uuid),
                e.quantityOverride,
            ])
            .filter(([, d]: any) => !!d),
    );
</script>

<article>
    <section class="section-wrapper">
        <DropArea
            type="uuid"
            documentType="Item"
            onDocumentDropped={(value) => updateEquipment(value)}
        />

        <ul class="a5e-document-list">
            {#each docs as [docId, doc, quantityOverride]}
                <li class="a5e-document-wrapper">
                    <img
                        class="a5e-document-img"
                        src={doc.img}
                        alt={doc.name}
                    />

                    <h3>{doc?.name}</h3>

                    {#if doc.isEmbedded}
                        <div class="a5e-quantity-wrapper">
                            <input
                                class="a5e-input a5e-input--slim a5e-input--small"
                                type="number"
                                id="{doc.uuid}-quantityOverride"
                                value={quantityOverride ||
                                    doc.system.quantity ||
                                    1}
                                min="1"
                                onchange={({ currentTarget }) => {
                                    updateDocumentDataFromField(
                                        item,
                                        `system.items.${docId}.quantityOverride`,
                                        parseInt(currentTarget?.value ?? 1),
                                    );
                                }}
                            />
                        </div>
                    {/if}

                    <button
                        class="a5e-button a5e-button--transparent delete-button"
                        data-tooltip="A5E.ButtonToolTipDelete"
                        data-tooltip-direction="UP"
                        aria-label="Delete Equipment"
                        onclick={() => deleteEquipment(doc.uuid)}
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </li>
            {/each}
        </ul>
    </section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow-y: auto;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.275rem;
    }

    .a5e-document-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        margin: 0;
        list-style: none;
        overflow-y: auto;
    }

    .a5e-document-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-right: 0.5rem;
        font-size: var(--a5e-sm-text);
        background: var(--a5e-color-background-light);
        border-radius: var(--a5e-border-radius-standard);
        border: 1px solid var(--a5e-color-border);

        h3 {
            margin: 0;
            flex: 1;
            font-size: var(--a5e-sm-text);
        }
    }

    .a5e-document-img {
        height: 2rem;
        width: 2rem;
        border-radius: var(--a5e-border-radius-standard);
    }

    .delete-button {
        margin-inline: auto 0.5rem;
        padding: 0.25rem;
    }

    .a5e-quantity-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .number-input {
        background: transparent;
        border: 1px solid var(--input-border-color, var(--a5e-color-border));
        height: 1.125rem;
        width: 7ch;
        font-size: var(--a5e-xs-text);
        text-align: center;

        &:hover {
            border: 1px solid var(--input-border-color, var(--a5e-color-border));
        }
    }
</style>
