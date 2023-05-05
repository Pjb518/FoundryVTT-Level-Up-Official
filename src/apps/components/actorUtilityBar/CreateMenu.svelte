<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import {
        TJSMenu,
        TJSToggleIconButton,
    } from "@typhonjs-fvtt/svelte-standard/component";
    import { createEventDispatcher } from "svelte";

    import createItem from "../../../utils/createItem";
    import createEffect from "../../../utils/createActiveEffect";

    export let documentName = "Item";
    export let menuList = [[]];
    export let offset = null;
    export let reducerType = null;

    // Default createDocument
    function createDocument(entityType) {
        if (!["Item", "ActiveEffect"].includes(documentName))
            return dispatch("press", entityType);

        if (documentName === "Item" && $document.documentName === "Actor")
            return createItem($document, reducerType.slice(0, -1), entityType);

        if (documentName === "ActiveEffect")
            return createEffect($document, entityType);
    }

    const document = getContext("actor") ?? getContext("item");
    const dispatch = createEventDispatcher();
</script>

<TJSToggleIconButton
    title="Add {documentName}"
    icon="fas fa-plus"
    --tjs-icon-button-background-hover="none"
    --tjs-icon-button-background-focus="none"
    --tjs-icon-button-background-focus-visible="none"
    --tjs-icon-button-background-selected="none"
    --tjs-icon-button-text-shadow-hover="none"
    --tjs-icon-button-text-shadow-focus="none"
    --tjs-icon-button-transition="all 0.15s ease-in-out"
    --tjs-icon-button-diameter="1rem"
    --tjs-icon-button-border-radius="0"
>
    <TJSMenu {offset}>
        <article>
            {#each menuList as [type, heading]}
                <button on:click|preventDefault={() => createDocument(type)}>
                    {localize(heading)}
                </button>
            {/each}
        </article>
    </TJSMenu>
</TJSToggleIconButton>

<style>
    article {
        position: relative;
        display: grid;
        min-width: 15rem;

        grid-template-columns: repeat(3, minmax(max-content, 1fr));
        gap: 0.125rem;
        padding: 0.125rem 0.125rem;
        white-space: nowrap;
    }

    button {
        background: transparent;
        color: white;
        font-size: 0.694rem;
    }
</style>
