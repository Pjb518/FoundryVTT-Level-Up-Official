<script>
    import { createEventDispatcher } from "svelte";

    export let uuids = [];
    export let singleDocument = false;

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
                <div class="document-wrapper">
                    <img
                        class="document-image"
                        src={firstDocument?.img}
                        alt={firstDocument?.name}
                        title={firstDocument?.name}
                    />

                    <h3>{firstDocument?.name}</h3>

                    <button
                        class="a5e-button a5e-button--delete delete-button fas fa-trash"
                        data-tooltip="A5E.ButtonToolTipDelete"
                        data-tooltip-direction="UP"
                        on:click={(event) =>
                            dispatch("item-deleted", [event, docs])}
                    />
                </div>
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
                    <li class="document-wrapper">
                        <img
                            class="document-image"
                            src={doc.img}
                            alt={doc.name}
                            title={doc.name}
                        />

                        <h3>{doc?.name}</h3>
                        <button
                            class="a5e-button a5e-button--delete delete-button fas fa-trash"
                            data-tooltip="A5E.ButtonToolTipDelete"
                            data-tooltip-direction="UP"
                            on:click={(event) =>
                                dispatch("item-deleted", [event, uuid])}
                        />
                    </li>
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

    .document-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-right: 0.5rem;
        font-size: 0.833rem;
        background: #f6f2eb;
        border-radius: 3px;
        border: 1px solid #ccc;

        h3 {
            font-size: 0.833rem;
        }
    }

    .document-image {
        height: 2rem;
        width: 2rem;
        border-radius: 3px;
    }

    .delete-button {
        margin-inline: auto 0.5rem;
        padding: 0.25rem;
    }
</style>
