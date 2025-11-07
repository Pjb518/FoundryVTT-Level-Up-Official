<script lang="ts">
    import { getContext } from "svelte";

    import DropArea from "../dropAreas/DropArea.svelte";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item: any = getContext("item");

    async function updateEquipment({ uuid }: { uuid: string }) {
        let child: any;
        try {
            const doc = await Item.fromDropData({ uuid });
            if ($item.isEmbedded) {
                child = (await $item.actor.createEmbeddedDocuments("Item", [doc]))?.[0];
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

        await $item.containerItems.add(child.uuid);
        const actor = $item?.parent?.documentName === "Actor" ? $item.parent : null;

        if (!actor) return;
        if (actor.uuid !== $item.parent?.uuid) return;

        await child.update({ "system.containerId": $item.uuid });
    }

    async function deleteEquipment(uuid: string) {
        console.log(uuid);
        const child = await fromUuid(uuid);
        await $item.containerItems.remove(uuid);

        const actor = $item?.parent?.documentName === "Actor" ? $item.parent : null;

        if (!actor || !child) return;
        if (actor.uuid !== $item.parent?.uuid) return;
        await child.update({ "system.containerId": "" });
    }

    $: docs = Object.entries($item.system.items ?? {})
        .map(([id, e]: any) => [id, fromUuidSync(e.uuid), e.quantityOverride])
        .filter(([, d]: any) => !!d);
</script>

<article>
    <section class="section-wrapper">
        <DropArea
            type="uuid"
            documentType="Item"
            on:document-dropped={({ detail }) => updateEquipment(detail)}
        />

        <ul class="document-list">
            {#each docs as [docId, doc, quantityOverride]}
                <li class="document-wrapper">
                    <img class="document-img" src={doc.img} alt={doc.name} />

                    <h3>{doc?.name}</h3>

                    {#if doc.isEmbedded}
                        <div class="quantity-wrapper">
                            <input
                                class="number-input"
                                type="number"
                                id="{doc.uuid}-quantityOverride"
                                value={quantityOverride || doc.system.quantity || 1}
                                min="1"
                                on:change={({ target }) => {
                                    updateDocumentDataFromField(
                                        $item,
                                        `system.items.${docId}.quantityOverride`,
                                        // @ts-ignore
                                        parseInt(target?.value ?? 1),
                                    );
                                }}
                            />
                        </div>
                    {/if}

                    <button
                        class="a5e-button a5e-button--delete delete-button icon fas fa-trash"
                        data-tooltip="A5E.buttons.tooltips.delete"
                        data-tooltip-direction="UP"
                        on:click={() => deleteEquipment(doc.uuid)}
                    />
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

    .document-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        margin: 0;
        list-style: none;
        overflow-y: auto;
    }

    .document-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-right: 0.5rem;
        font-size: var(--a5e-text-size-sm);
        background: var(--a5e-background-light);
        border-radius: var(--a5e-border-radius-standard);
        border: 1px solid #ccc;

        h3 {
            flex: 1;
            font-size: var(--a5e-text-size-sm);
        }
    }

    .document-img {
        height: 2rem;
        width: 2rem;
        border-radius: var(--a5e-border-radius-standard);
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
        font-size: var(--a5e-text-size-xs);
        text-align: center;

        &:hover {
            border: 1px solid var(--input-border-color, #bbb);
        }
    }
</style>
