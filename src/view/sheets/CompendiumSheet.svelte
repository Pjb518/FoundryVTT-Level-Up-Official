<script lang="ts">
    import { onDestroy, setContext } from "svelte";

    import { GenericConfigDialog } from "../dialogs/initializers/GenericConfigDialog.svelte.ts";

    import CompendiumItemList from "./pages/compendia/CompendiumItemList.svelte";
    import CompendiumFiltersTab from "./pages/compendia/CompendiumFiltersTab.svelte";
    // import CompendiumFilters from "../components/compendiumSheets/CompendiumFilters.svelte";
    // import CompendiumItemList from "../components/compendiumSheets/CompendiumItemList.svelte";
    // import ExportToRollTableDialog from "../dialogs/ExportToRollTableDialog.svelte";

    // import {
    //     addSearchFilter,
    //     removeSearchFilter,
    // } from "../handlers/handleSearchFilter";
    // import constructReducerFilters from "../handlers/constructReducerFilters";
    //

    type Props = {
        compendiumType: string;
        customImporter: (documents: any[]) => void;
        pack: any;
        sheet: any;
    };

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

    function getDocuments() {
        let docs = pack.index.map((entry) => entry);

        // Sort the documents into alphabetical order
        docs.sort((a, b) => a.name.localeCompare(b.name));
        return docs;
    }

    function handleScroll(scrollPosition) {
        if (scrollPosition > 80) visibleDocumentCount += 50;
    }

    let { compendiumType, customImporter, pack, sheet }: Props = $props();

    let viewTab = $state("items");
    let includeDescriptions = $state(false);
    let enableGrouping = $state(false);

    let filterOptions = $state({
        searchTerm: "",
    });

    let documents = $state(getDocuments());
</script>

<main class="a5e-compendia-main-wrapper">
    <header class="a5e-compendia-header">
        {#if viewTab === "items"}
            <!--  -->
            <input
                class="a5e-input a5e-input--slim a5e-compendia-header__search-bar"
                type="text"
                bind:value={filterOptions.searchTerm}
                placeholder={game.i18n.localize("Search ...")}
            />

            {#if showGroupingToggle()}
                <!--  -->
            {/if}

            {#if showRollTableToggle()}
                <!--  -->
            {/if}
        {/if}

        {#if showFilterToggle()}
            <button
                class="a5e-button"
                aria-label={viewTab === "items"
                    ? "Open Filter Tab"
                    : "Close Filter Tab"}
                data-tooltip={viewTab === "items"
                    ? "Open Filter Tab"
                    : "Close Filter Tab"}
                data-tooltip-direction="UP"
                onclick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    viewTab = viewTab === "items" ? "filters" : "items";
                }}
            >
                <i class="a5e-compendia-header__button fa-solid fa-filter"></i>
            </button>
        {/if}
    </header>

    <section class="a5e-compendia-body">
        {#if viewTab === "items"}
            <CompendiumItemList {documents} {compendiumType} {enableGrouping} />
        {:else}
            <CompendiumFiltersTab {documents} {compendiumType} />
        {/if}
    </section>

    <footer class="a5e-compendia-footer"></footer>
</main>
