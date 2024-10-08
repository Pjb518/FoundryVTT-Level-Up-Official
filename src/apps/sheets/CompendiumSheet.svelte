<svelte:options accessors={true} />

<script>
    import { getContext, onDestroy, setContext } from "svelte";

    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { DynMapReducer } from "#runtime/svelte/store/reducer";
    import { TJSInput } from "#standard/component";

    import GenericDialog from "../dialogs/initializers/GenericDialog";

    import CompendiumFilters from "../components/compendiumSheets/CompendiumFilters.svelte";
    import CompendiumItemList from "../components/compendiumSheets/CompendiumItemList.svelte";
    import ExportToRollTableDialog from "../dialogs/ExportToRollTableDialog.svelte";

    import { addSearchFilter, removeSearchFilter } from "../handlers/handleSearchFilter";
    import constructReducerFilters from "../handlers/constructReducerFilters";

    export let { compendiumType, customImporter, document, filterStore, sheet } =
        getContext("#external").application;

    export let elementRoot;

    function showDescriptionToggle() {
        return true;
    }

    function showGroupingToggle() {
        if (["classFeature", "archetype"].includes(compendiumType)) return false;
        return true;
    }

    function showRollTableToggle() {
        if (["classFeature", "archetype"].includes(compendiumType)) return false;
        return true;
    }

    function showFilterToggle() {
        return true;
    }

    async function exportToActor() {
        const collection = document;

        const documents = (
            await Promise.all(
                [...$reducer].map(async (doc) => collection.getDocument(doc._id)),
            )
        ).map((doc) => doc.toObject());

        customImporter(documents);
    }

    async function exportToRollTable() {
        // Create a dialog to fetch the name of the roll table
        let dialog = new GenericDialog("Export to RollTable", ExportToRollTableDialog);

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

    reducer.setData(getDocuments([...document.index]), true);

    $: searchInput = addSearchFilter(reducer, includeDescriptions);

    // Set contexts and unsubscribes
    setContext("collection", document);
    setContext("customImporter", customImporter);
    setContext("filterStore", filterStore);
    setContext("reducer", reducer);
    setContext("sheet", sheet);

    const reducerUnsubscribe = reducer.subscribe(() => (visibleDocumentCount = 100));

    // Construct filters for the reducer
    let filterSelections = {};
    const filterStoreUnsubscribe = filterStore.subscribe((store) => {
        filterSelections = store;
    });

    $: filterCount = constructReducerFilters(reducer, filterSelections, compendiumType);

    // On Destroy
    onDestroy(() => {
        removeSearchFilter(reducer);
        reducerUnsubscribe();
        filterStoreUnsubscribe();
    });

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
                {#if showDescriptionToggle()}
                    <button
                        class="a5efc-filter-button"
                        class:a5efc-filter-button--active={includeDescriptions}
                        data-tooltip={includeDescriptions
                            ? "Exclude item descriptions in search"
                            : "Include item descriptions in search"}
                        data-tooltip-direction="UP"
                        on:click={() => (includeDescriptions = !includeDescriptions)}
                    >
                        <i class="a5efc-filter-button__icon fa-solid fa-book" />
                    </button>
                {/if}

                {#if showGroupingToggle()}
                    <button
                        class="a5efc-filter-button"
                        class:a5efc-filter-button--active={enableGrouping}
                        data-tooltip={enableGrouping
                            ? "Disable grouping of documents"
                            : "Enable grouping of documents"}
                        data-tooltip-direction="UP"
                        on:click={() => (enableGrouping = !enableGrouping)}
                    >
                        <i class="a5efc-filter-button__icon fa-solid fa-bars-staggered" />
                    </button>
                {/if}

                <!-- TODO: Update this -->
                {#if showRollTableToggle()}
                    {#if !customImporter}
                        <button
                            class="a5efc-filter-button"
                            data-tooltip="Export {[...$reducer]
                                .length} Documents to Rolltable"
                            data-tooltip-direction="UP"
                            on:click={() => exportToRollTable()}
                        >
                            <i class="a5efc-filter-button__icon fa-solid fa-table-list" />
                        </button>
                    {:else if compendiumType === "spell" || compendiumType === "maneuver"}
                        <button
                            class="a5efc-filter-button"
                            data-tooltip="Export {[...$reducer]
                                .length} Documents to Actor"
                            data-tooltip-direction="UP"
                            on:click={() => exportToActor()}
                        >
                            <i class="a5efc-filter-button__icon fa-solid fa-download" />
                        </button>
                    {/if}
                {/if}
            {/if}

            {#if showFilterToggle()}
                <button
                    class="a5efc-filter-button"
                    class:a5efc-filter-button--active={tab === "filters" ||
                        filterCount.and ||
                        filterCount.or}
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
            {/if}
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
