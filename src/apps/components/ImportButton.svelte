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
    class="a5efc-document__import-button fa-solid fa-download"
    data-tooltip={`Import ${document.name}`}
    data-tooltip-direction="UP"
    on:click|stopPropagation={async () => importDocument()}
/>
