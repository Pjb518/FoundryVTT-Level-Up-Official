<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSIconButton } from "#standard/component";

    import {
        sortAscending,
        sortDescending,
    } from "../../handlers/sortingHandlers";

    export let reducerType;
    export let documentName = "Item";

    const document = getContext("actor") ?? getContext("item");
    const reducer = document[reducerType];

    const sortIcons = {
        0: "fa-sort",
        1: "fa-arrow-down-a-z",
        2: "fa-arrow-down-z-a",
    };

    // TODO: Change when custom sort is implemented
    const sortMappings = {
        0: sortAscending,
        1: sortDescending,
        2: sortAscending,
    };

    async function onSortReducer() {
        await sortMappings[sortMode]($document, $reducer, documentName);

        // TODO: Change when custom sort is implemented
        let newMode = (sortMode + 1) % 3;
        newMode = newMode === 0 ? 1 : newMode;

        await $document.setFlag("a5e", "sortMode", newMode);
    }

    $: sortMode = $document.getFlag("a5e", "sortMode") || 0;
</script>

<TJSIconButton
    title="Sort"
    icon={`fas ${sortIcons[sortMode]}`}
    onPress={onSortReducer}
    --tjs-icon-button-background-hover="none"
    --tjs-icon-button-background-focus="none"
    --tjs-icon-button-background-focus-visible="none"
    --tjs-icon-button-background-selected="none"
    --tjs-icon-button-text-shadow-hover="none"
    --tjs-icon-button-text-shadow-focus="none"
    --tjs-icon-button-transition="$standard-transition"
    --tjs-icon-button-diameter="1rem"
    --tjs-icon-button-border-radius="0"
/>
