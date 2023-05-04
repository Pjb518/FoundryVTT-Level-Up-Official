<script>
    import { getContext, onDestroy } from "svelte";
    import {
        TJSMenu,
        TJSToggleIconButton,
    } from "@typhonjs-fvtt/svelte-standard/component";

    import updateFilters from "../../utils/updateFilters";

    import FilterBox from "../FilterBox.svelte";

    export let reducerType;

    const actor = getContext("actor");
    const reducer = actor[reducerType];

    const filterSections = Object.values(CONFIG.A5E.filters[reducerType] ?? {});
    let filters = $actor.getFlag("a5e", `filters.${reducerType}`) ?? {};

    updateFilters(reducer, reducerType, filters);

    function onUpdateFilters(inclusiveFilters, exclusiveFilters) {
        $actor.setFlag("a5e", `filters.${reducerType}`, {
            inclusive: inclusiveFilters,
            exclusive: exclusiveFilters,
        });

        filters.inclusive = inclusiveFilters;
        filters.exclusive = exclusiveFilters;

        updateFilters(reducer, reducerType, filters);
    }
</script>

<TJSToggleIconButton title="Filters" icon="fas fa-filter">
    <TJSMenu>
        <FilterBox {filterSections} activeFilters={filters} {onUpdateFilters} />
    </TJSMenu>
</TJSToggleIconButton>
