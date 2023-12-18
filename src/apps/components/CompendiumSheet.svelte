<svelte:options accessors={true} />

<script>
    import { getContext, onDestroy, setContext } from "svelte";

    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { DynMapReducer } from "#runtime/svelte/store/reducer";
    import { TJSInput } from "#standard/component";

    import GenericDialog from "../dialogs/GenericDialog";

    import CompendiumFilters from "./CompendiumFilters.svelte";
    import CompendiumItemList from "./CompendiumItemList.svelte";
    import ExportToRollTableDialog from "../dialogs/ExportToRollTableDialog.svelte";

    import {
        addSearchFilter,
        removeSearchFilter,
    } from "../handlers/handleCompendiumSearchFilter";

    export let { compendiumType, document, filterStore, sheet } =
        getContext("#external").application;

    export let elementRoot;

    async function exportToRollTable() {
        // Create a dialog to fetch the name of the roll table
        let dialog = new GenericDialog(
            "Export to RollTable",
            ExportToRollTableDialog,
        );

        dialog.render(true);
        const { rollTableName } = (await dialog.promise) ?? {};

        if (!rollTableName) return;

        const rollTableData = {
            name: `${rollTableName}`,
            formula: `1d${[...$reducer].length}`,
            replacement: true,
            results: [...$reducer].map((doc, idx) => ({
                documentCollection: document.metadata.id,
                documentId: doc._id,
                img: doc.img,
                text: doc.name,
                range: [idx + 1, idx + 1],
                type: 2,
                weight: 1,
            })),
        };

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

    let tab = "items";
    let includeDescriptions = false;
    let reducer = new DynMapReducer();
    let visibleDocumentCount = 100;

    onDestroy(() => removeSearchFilter(reducer));

    reducer.setData(getDocuments([...document.index]), true);

    $: searchInput = addSearchFilter(reducer, includeDescriptions);

    setContext("collection", document);
    setContext("filterStore", filterStore);
    setContext("reducer", reducer);

    const unsubscribe = reducer.subscribe(() => (visibleDocumentCount = 100));

    onDestroy(unsubscribe);

    $: enableGrouping = false;
</script>

<ApplicationShell bind:elementRoot>
    <main class="a5efc-main-wrapper">
        <div class="a5efc-search-field">
            <TJSInput
                input={searchInput}
                --tjs-input-placeholder-color="#555"
                --tjs-input-text-margin="0"
                --tjs-input-text-width="100%"
            />

            {#if tab === "items"}
                <button
                    class="a5efc-filter-button"
                    class:a5efc-filter-button--active={includeDescriptions}
                    data-tooltip={includeDescriptions
                        ? "Exclude item descriptions in search"
                        : "Include item descriptions in search"}
                    data-tooltip-direction="UP"
                    on:click={() =>
                        (includeDescriptions = !includeDescriptions)}
                >
                    <i class="a5efc-filter-button__icon fa-solid fa-book" />
                </button>

                <button
                    class="a5efc-filter-button"
                    class:a5efc-filter-button--active={enableGrouping}
                    data-tooltip={enableGrouping
                        ? "Disable grouping of documents"
                        : "Enable grouping of documents"}
                    on:click={() => (enableGrouping = !enableGrouping)}
                >
                    <i
                        class="a5efc-filter-button__icon fa-solid fa-bars-staggered"
                    />
                </button>

                <button
                    class="a5efc-filter-button"
                    data-tooltip="Export {[...$reducer]
                        .length} Documents to Rolltable"
                    data-tooltip-direction="UP"
                    on:click={() => exportToRollTable()}
                >
                    <i
                        class="a5efc-filter-button__icon fa-solid fa-table-list"
                    />
                </button>
            {/if}

            <button
                class="a5efc-filter-button"
                class:a5efc-filter-button--active={tab === "filters"}
                data-tooltip={tab === "items"
                    ? "Open Filter Page"
                    : "Close Filter Page"}
                data-tooltip-direction="UP"
                on:click={() => {
                    tab = tab === "items" ? "filters" : "items";
                }}
            >
                <i class="a5efc-filter-button__icon fa-solid fa-filter" />
            </button>
        </div>

        <svelte:component
            this={tab === "items" ? CompendiumItemList : CompendiumFilters}
            documents={[...$reducer].slice(0, visibleDocumentCount)}
            {compendiumType}
            {enableGrouping}
            on:listScrolled={({ detail }) => handleScroll(detail)}
        />

        {#if tab === "items"}
            <footer class="a5efc-footer">
                Showing {[...$reducer].length} of {[...document.index].length} items
            </footer>
        {/if}
    </main>
</ApplicationShell>
