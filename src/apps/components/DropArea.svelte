<script>
    import { createEventDispatcher } from "svelte";
    import OriginItemWrapper from "./OriginItemWrapper.svelte";

    export let uuids = [];
    export let singleDocument = false;
    export let attribute = null;

    const dispatch = createEventDispatcher();

    async function getDocs() {
        const docs = new Map();
        for await (const uuid of uuids) {
            const doc = await fromUuid(uuid);
            if (doc) docs.set(uuid, doc);
        }
        return docs;
    }

    $: docs = getDocs(uuids)
        .then((data) => (docs = data))
        .catch((err) => (docs = err));
    $: firstDocument = Array.from(docs)?.[0]?.[1] ?? null;
</script>

{#await docs}
    <p>Loading...</p>
{:then docs}
    <section class="drop-container">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#if singleDocument && firstDocument}
            <div class="drop-area">
                <OriginItemWrapper
                    uuid={firstDocument.uuid}
                    doc={firstDocument}
                    on:item-deleted={(event) =>
                        dispatch("item-deleted", [event, firstDocument.uuid])}
                />
            </div>
        {:else}
            <div
                class="drop-area"
                on:drop|preventDefault|stopPropagation={(event) =>
                    dispatch("item-dropped", [event, docs])}
            >
                <i class="drop-icon fa-sold fa-plus" />
            </div>
        {/if}

        {#if !singleDocument}
            <div class="document-list">
                {#each docs as [uuid, doc]}
                    <OriginItemWrapper
                        {uuid}
                        {doc}
                        {attribute}
                        on:item-deleted={(event) =>
                            dispatch("item-deleted", [event, uuid])}
                    />
                {/each}
            </div>
        {/if}
    </section>
{/await}

<style lang="scss">
    .drop-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .drop-area {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 3.25rem;
        border-radius: 4px;
        border: 2px dashed #bbb;
        padding: 0.125rem;
        box-sizing: border-box;
    }

    .drop-icon {
        color: #888;
        font-size: 1.44rem;
        font-style: normal;
    }

    .document-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0;
        margin: 0;
        list-style: none;
        overflow-y: auto;
    }
</style>
