<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";

    import {
        addSearchFilter,
        removeSearchFilter,
    } from "../../handlers/handleSearchFilter";

    export let reducerType;

    const actor = getContext("actor");
    const reducer = actor[reducerType];

    const input = addSearchFilter(reducer);
    onDestroy(() => removeSearchFilter(reducer));
</script>

<div class="search-container">
    <TJSInput {input} --tjs-input-placeholder-color="#555" />
</div>

<style lang="scss">
    .search-container {
        flex-grow: 1;

        color: black;
    }
</style>
