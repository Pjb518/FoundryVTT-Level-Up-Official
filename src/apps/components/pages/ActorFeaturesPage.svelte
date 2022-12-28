<script>
  import { getContext } from "svelte";
  import { TJSInput } from "@typhonjs-fvtt/svelte-standard/component";
  import { createFilterQuery } from "@typhonjs-fvtt/svelte-standard/store";

  import addReducerFilter from "../../utils/addReducerFilter";

  import ItemCategory from "../ItemCategory.svelte";

  const actor = getContext("actor");
  const { features } = actor;

  const filterSearch = createFilterQuery("name");
  const input = {
    store: filterSearch,
    placeholder: "Search...",
    type: "search",
  };

  addReducerFilter(features, { id: "searchFilter", filter: filterSearch });
</script>

<div class="features-page">
  <header class="search-container">
    <TJSInput {input} />

    <i class="fas fa-sort" />
    <i class="fas fa-filter" />
  </header>

  <section class="features-main-container">
    {#each Object.entries($features._types) as [label, items]}
      {#if items.length}
        <ItemCategory {label} {items} type="featureTypes" />
      {/if}
    {/each}
  </section>

  <footer class="features-footer" />
</div>

<style lang="scss">
  .features-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.5rem;
    overflow: hidden;
  }
  .search-container {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .features-main-container {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    gap: 0.25rem;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
