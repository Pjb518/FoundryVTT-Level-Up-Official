<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSIconButton } from "@typhonjs-fvtt/svelte-standard/component";

    import {
        sortAscending,
        sortDescending,
    } from "../../handlers/sortingHandlers";

    export let reducerType;
    export let documentName = "Item";

    const actor = getContext("actor");
    const reducer = actor[reducerType];

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

    function onSortReducer() {
        sortMappings[sortMode]($actor, $reducer, documentName);

        // TODO: Change when custom sort is implemented
        let newMode = (sortMode + 1) % 3;
        newMode = newMode === 0 ? 1 : newMode;

        $actor.setFlag("a5e", "sortMode", newMode);
    }

    $: sortMode = $actor.getFlag("a5e", "sortMode") || 0;
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
    --tjs-icon-button-transition="all 0.15s ease-in-out"
/>
