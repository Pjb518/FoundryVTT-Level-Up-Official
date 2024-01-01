<script>
    import { getContext } from "svelte";

    export let document;

    async function importDocument() {
        const doc = await collection.getDocument(document._id);

        if (customImporter) {
            customImporter([doc]);
            return;
        }

        doc.collection.importFromCompendium(doc.compendium, doc._id);
    }

    const collection = getContext("collection");
    const customImporter = getContext("customImporter");
</script>

<button
    class="a5e-compendium-import-button fa-solid fa-download"
    data-tooltip={`Import ${document.name}`}
    data-tooltip-direction="UP"
    on:click|stopPropagation={async () => importDocument()}
/>

<style lang="scss">
    .a5e-compendium-import-button {
        grid-area: import;
        margin: 0;
        padding: 0.25rem;
        color: #888;
        background: transparent;
        border: 0;
        transition: var(--a5e-transition-standard);

        &:hover {
            color: #191813;
            transform: scale(1.2);
            box-shadow: none;
        }
    }
</style>
