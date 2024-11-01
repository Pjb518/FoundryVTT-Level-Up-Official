<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let uuid: string = "";
    const dispatch = createEventDispatcher();

    $: doc = fromUuidSync(uuid);
</script>

<section class="drop-container">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#if doc}
        <div
            class="drop-area"
            on:drop|preventDefault|stopPropagation={(event) => {
                dispatch("document-dropped", [event, doc]);
            }}
        >
            <div class="document-wrapper">
                <img
                    class="document-image"
                    src={doc.img}
                    alt={doc.name}
                    title={doc.name}
                />

                <h3>{doc.name}</h3>

                <button
                    class="a5e-button a5e-button--delete delete-button fas fa-trash"
                    data-tooltip="A5E.ButtonToolTipDelete"
                    data-tooltip-direction="UP"
                    on:click={(event) => dispatch("document-deleted", [event, uuid])}
                />
            </div>
        </div>
    {:else}
        <div
            class="drop-area"
            on:drop|preventDefault|stopPropagation={(event) =>
                dispatch("document-dropped", [event, doc])}
        >
            <i class="drop-icon fa-sold fa-plus" />
        </div>
    {/if}
</section>

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
        font-size: var(--a5e-text-size-xl);
        font-style: normal;
    }

    .document-wrapper {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 0.25rem;
        padding-right: 0.5rem;
        font-size: var(--a5e-text-size-sm);
        background: --a5e-color-background-light;
        border-radius: var(--a5e-border-radius-standard);
        border: 1px solid #ccc;

        h3 {
            flex: 1;
            font-size: var(--a5e-text-size-sm);
        }
    }

    .document-image {
        height: 2rem;
        width: 2rem;
        border-radius: var(--a5e-border-radius-standard);
    }

    .delete-button {
        margin-inline: auto 0.5rem;
        padding: 0.25rem;
    }
</style>
