<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";

    import { ApplicationShell } from "#runtime/svelte/component/core";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CompendiumFilters from "../components/CompendiumFilters.svelte";
    import CompendiumItemList from "../components/CompendiumItemList.svelte";
    import Spinner from "../components/Spinner.svelte";

    async function getDocuments(docList) {
        // Sort the documents into alphabetical order
        docList.sort((a, b) => a.name.localeCompare(b.name));

        const validDocs = [];

        // Create a TJSDocument for each document in the compendium. Filter out invalid docs.
        for (const { uuid } of docList) {
            const doc = new TJSDocument();
            const setSuccessfully = await doc.setFromUUID(uuid);

            if (setSuccessfully) validDocs.push(doc);
        }

        return validDocs;
    }

    export let { compendiumType, document, sheet } =
        getContext("#external").application;

    export let elementRoot;

    // TODO: Rreplace with a fancy reducer
    const documents = getDocuments([...document.index]);
</script>

<ApplicationShell bind:elementRoot>
    <main>
        <CompendiumFilters {compendiumType} />

        <input
            class="search-field"
            type="text"
            placeholder="Definitely a search field"
        />

        {#await documents}
            <div class="spinner-wrapper">
                <Spinner />
            </div>
        {:then reactiveDocuments}
            <CompendiumItemList
                documents={reactiveDocuments}
                {compendiumType}
            />
        {/await}
    </main>
</ApplicationShell>

<style lang="scss">
    :global(.a5e-compendium-sheet) {
        min-height: 80vh;
        max-height: 80vh;
    }

    :global(.a5e-compendium-sheet .window-content) {
        padding: 0 !important;
    }

    .spinner-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-area: list;
        height: 100%;
        width: 100%;
    }

    .search-field {
        grid-area: search;
    }

    main {
        display: grid;
        grid-template-areas:
            "filters search"
            "filters list";
        grid-template-rows: 2rem 1fr;
        grid-template-columns: 15rem 1fr;
        column-gap: 0.5rem;
        height: 100%;
        padding: 0.5rem;
        padding-right: 0.25rem;
        background: rgba(246, 242, 235, 0.5);
        overflow: hidden;
    }
</style>
