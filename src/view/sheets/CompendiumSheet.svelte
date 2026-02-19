<script lang="ts">
    import { onDestroy, setContext } from "svelte";

    import { GenericConfigDialog } from "../dialogs/initializers/GenericConfigDialog.svelte.ts";

    // import CompendiumFilters from "../components/compendiumSheets/CompendiumFilters.svelte";
    // import CompendiumItemList from "../components/compendiumSheets/CompendiumItemList.svelte";
    // import ExportToRollTableDialog from "../dialogs/ExportToRollTableDialog.svelte";

    // import {
    //     addSearchFilter,
    //     removeSearchFilter,
    // } from "../handlers/handleSearchFilter";
    // import constructReducerFilters from "../handlers/constructReducerFilters";
    //

    type Props = {};

    function showDescriptionToggle() {
        return true;
    }

    function showGroupingToggle() {
        if (["classFeature", "archetype"].includes(compendiumType))
            return false;
        return true;
    }

    function showRollTableToggle() {
        if (["classFeature", "archetype"].includes(compendiumType))
            return false;
        return true;
    }

    function showFilterToggle() {
        return true;
    }

    async function exportToActor() {
        const collection = document;

        // const documents = (
        //     await Promise.all(
        //         [...$reducer].map(async (doc) =>
        //             collection.getDocument(doc._id),
        //         ),
        //     )
        // ).map((doc) => doc.toObject());

        customImporter(documents);
    }

    async function exportToRollTable() {
        // Create a dialog to fetch the name of the roll table
        let dialog = new GenericConfigDialog(
            "Export to RollTable",
            ExportToRollTableDialog,
        );

        dialog.render(true);
        const { rollTableName } = (await dialog.promise) ?? {};

        if (!rollTableName) return;

        // const rollTableData = {
        //     name: `${rollTableName}`,
        //     formula: `1d${[...$reducer].length}`,
        //     replacement: true,
        //     results: [...$reducer].map((doc, idx) => ({
        //         documentCollection: document.metadata.id,
        //         documentId: doc._id,
        //         img: doc.img,
        //         text: doc.name,
        //         range: [idx + 1, idx + 1],
        //         type: 2,
        //         weight: 1,
        //     })),
        // };

        RollTable.create(rollTableData);
    }

    function getDocuments(docList) {
        // Sort the documents into alphabetical order
        docList.sort((a, b) => a.name.localeCompare(b.name));

        const validDocs = new Map();
        docList.forEach((doc) => validDocs.set(doc._id, doc));
        return validDocs;
    }

    function handleScroll(scrollPosition) {
        if (scrollPosition > 80) visibleDocumentCount += 50;
    }

    let { compendiumType, customImporter, pack, sheet }: Props = $props();
</script>

<main class="a5efc-main-wrapper">Hello</main>
