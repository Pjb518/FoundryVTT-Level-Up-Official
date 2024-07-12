<script>
    import { getContext } from "svelte";

    import DeletionConfirmationDialog from "../dialogs/initializers/DeletionConfirmationDialog";

    export let document;

    async function deleteDocument() {
        const itemDocument = {
            name: document.name,
            type: "Document",
        };

        const dialog = new DeletionConfirmationDialog(itemDocument, true);
        await dialog.render(true);
        const dialogData = await dialog.promise;

        if (!dialogData || !dialogData?.confirmDeletion) return;

        const doc = await collection.getDocument(document._id);
        await doc.delete();

        await sheet.render(true);
    }

    const collection = getContext("collection");
    const sheet = getContext("sheet");
</script>

<button
    class="a5e-compendium-delete-button fa-solid fa-trash"
    data-tooltip={`Delete ${document.name}`}
    data-tooltip-direction="UP"
    on:click|stopPropagation={async () => deleteDocument()}
/>

<style lang="scss">
    .a5e-compendium-delete-button {
        grid-area: delete;
        margin: 0;
        padding: 0.25rem;
        color: #888;
        background: transparent;
        border: 0;
        transition: var(--a5e-transition-standard);

        &:hover {
            color: var(--a5e-color-error);
            transform: scale(1.2);
            box-shadow: none;
        }
    }
</style>
