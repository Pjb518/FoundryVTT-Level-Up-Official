<script>
    import { getContext, onDestroy } from "svelte";
    import { TJSInput } from "#standard/component";

    import {
        addSearchFilter,
        removeSearchFilter,
    } from "../../handlers/handleSearchFilter";

    export let reducerType;
    export let reducer = null;

    const document = getContext("actor") ?? getContext("item");

    if (!reducer) {
        reducer = document[reducerType];
    }

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
        font-size: var(--a5e-text-size-sm);
        color: black;
    }
</style>
