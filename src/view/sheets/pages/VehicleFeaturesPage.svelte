<script lang="ts">
  import { getContext } from "svelte";

  import createItem from "#utils/createItem.ts";
  import { filterItems } from "#utils/view/filterItems.ts";
  import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
  import { usesRequired } from "#utils/view/usesRequired.ts";

  import UtilityBar from "../../snippets/UtilityBar.svelte";
  import ItemCategory from "../components/ItemCategory.svelte";

  let actor: any = getContext("actor");
  let sheet: any = getContext("sheet");

  let filterOptions = $state({
    searchTerm: "",
    searchDescription: false,
    page: "features",
  });

  let showDescription = $state(false);

  const addIconOptions: string[][] = [
    ["driverFeature", CONFIG.A5E.featureTypes.driverFeature],
  ];

  let items = $derived(
    filterItems(actor.reactive, "feature", {
      searchTerm: filterOptions.searchTerm,
      searchDescription: filterOptions.searchDescription,
    }),
  );

  let categorizedItems = $derived(groupItemsByType(items, "featureType"));
  let showUses = $derived(usesRequired(items));

  function sortHandler(reverse: boolean) {
    sheet._sortEmbeddedAlphabetically(items, "Item", reverse);
  }
</script>

{#if actor.isOwner}
  <UtilityBar
    bind:filterOptions
    showAddIcon={true}
    {addIconOptions}
    showSearchDescriptionButton={true}
    showDescriptionButton={true}
    bind:showDescription
    showSortButton={true}
    {sortHandler}
    onAddIconClick={(subType) => createItem(actor, "feature", subType)}
  />
{/if}

<section class="a5e-page-wrapper a5e-page-wrapper--item-list">
  {#each Object.entries(categorizedItems) as [label, itemList]}
    {#if itemList?.length}
      <ItemCategory
        {label}
        {showDescription}
        {showUses}
        items={itemList}
        type="featureTypes"
      />
    {/if}
  {/each}
</section>
