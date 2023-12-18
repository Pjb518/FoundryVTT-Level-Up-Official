<script>
    import { getContext } from "svelte";

    export let document;

    const collection = getContext("collection");
</script>

<button
    class="a5efc-document__import-button fa-solid fa-download"
    data-tooltip={`Import ${document.name}`}
    data-tooltip-direction="UP"
    on:click|stopPropagation={async () => {
        const doc = await collection.getDocument(document._id);
        doc.collection.importFromCompendium(doc.compendium, doc._id);
    }}
/>
