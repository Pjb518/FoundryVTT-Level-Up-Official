<script>
    import { createEventDispatcher, getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    const dispatch = createEventDispatcher();

    export let doc;
    export let uuid;
</script>

<li class="document-wrapper">
    <img class="document-image" src={doc.img} alt={doc.name} title={doc.name} />

    <h3>{doc?.name}</h3>

    <button
        class="a5e-button a5e-button--delete delete-button fas fa-trash"
        data-tooltip="A5E.ButtonToolTipDelete"
        data-tooltip-direction="UP"
        on:click={(event) => dispatch("item-deleted", [event, uuid])}
    />
</li>

<style lang="scss">
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
