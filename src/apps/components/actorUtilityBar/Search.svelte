<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";

    import {
        addSearchFilter,
        removeSearchFilter,
    } from "../../handlers/handleSearchFilter";

    export let reducerType;

    const document = getContext("actor") ?? getContext("item");
    const reducer = document[reducerType];

    const input = addSearchFilter(reducer);
    onDestroy(() => removeSearchFilter(reducer));
</script>

<div class="search-container">
    <TJSInput
        {input}
        --tjs-input-placeholder-color="#555"
        --tjs-input-text-margin="0"
        --tjs-input-text-width="100%"
    />
</div>

<style lang="scss">
    .search-container {
        flex-grow: 1;
        font-size: 0.833rem;
        color: black;
    }
</style>
