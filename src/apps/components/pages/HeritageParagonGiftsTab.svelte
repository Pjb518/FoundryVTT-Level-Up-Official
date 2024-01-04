<script>
    import { getContext } from "svelte";

    import CreateMenu from "../actorUtilityBar/CreateMenu.svelte";
    import DropArea from "../dropAreas/OriginDropArea.svelte";
    import FormSection from "../LegacyFormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");

    async function addCategory() {
        $item.update({
            "system.paragonCategories": {
                ...$item.system.paragonGiftCategories,
                [foundry.utils.randomID()]: "New Paragon Category",
            },
        });
    }

    async function deleteCategory(id) {
        const uuids = Object.values($item.system.paragonGifts).reduce(
            (acc, gift) => {
                const { uuid, category } = gift;
                if (category === id) acc.push(uuid);
                return acc;
            },
            [],
        );

        await $item.paragonGifts.deleteDocuments(uuids);
        await $item.update({
            [`system.paragonCategories.-=${id}`]: null,
        });
    }

    async function updateHeritageFeatures(event, category) {
        const [dragEvent] = event.detail;
        try {
            const { uuid } = JSON.parse(
                dragEvent.dataTransfer.getData("text/plain"),
            );
            await $item.paragonGifts.add(uuid, { category });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteHeritageFeatures(event) {
        const [_, uuid] = event.detail;
        await $item.paragonGifts.delete(uuid);
    }

    $: categories = Object.entries($item.system.paragonCategories);
    $: paragonGifts = Object.values($item.system.paragonGifts).reduce(
        (acc, { uuid, category }) => {
            acc[category] ??= [];
            acc[category].push(uuid);
            return acc;
        },
        [],
    );
</script>

<article>
    <section class="section-wrapper">
        {#each categories as [id, label]}
            <FormSection --direction="column" --gap="0.5rem">
                <div class="category-header">
                    <input
                        class="a5e-input a5e-input--slim category-heading"
                        type="text"
                        value={label}
                        placeholder="New Paragon Category"
                        on:change={({ target }) =>
                            updateDocumentDataFromField(
                                $item,
                                `system.paragonCategories.${id}`,
                                target.value,
                            )}
                    />

                    <button
                        class="a5e-button a5e-button--delete fas fa-trash"
                        style="margin-right: 1.1rem;"
                        on:click={() => deleteCategory(id)}
                    />
                </div>

                <DropArea
                    uuids={paragonGifts[id] ?? []}
                    on:item-dropped={(e) => updateHeritageFeatures(e, id)}
                    on:item-deleted={(e) => deleteHeritageFeatures(e, id)}
                />
            </FormSection>
        {/each}
    </section>

    <div class="sticky-add-button">
        <CreateMenu
            menuList={[]}
            offset={{ x: -110, y: -120 }}
            documentName="Heritage"
            on:press={addCategory}
        />
    </div>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 1rem;
        overflow-y: hidden;
    }

    .section-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex-grow: 1;
        overflow-y: auto;
    }

    .category-header {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        padding-inline-end: 0.2rem;
    }

    .category-heading {
        width: 70%;
        border: none;
        background-color: transparent;
        padding: 0;
        font-weight: bold;
    }

    .sticky-add-button {
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #999;
    }
</style>
