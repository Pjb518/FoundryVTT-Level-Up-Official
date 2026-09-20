<script lang="ts">
  import { getContext } from "svelte";
  import createItem from "#utils/createItem.ts";
  import { filterItems } from "#utils/view/filterItems.ts";
  import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
  import ItemCategory from "#view/sheets/components/ItemCategory.svelte";
  import UtilityBar from "#view/snippets/UtilityBar.svelte";

  let party: Actor.OfType<"party"> = getContext("party");

  // Inventory vars
  let filterOptions = $state({
    searchTerm: "",
    searchDescription: false,
  });

  let items = $derived(
    filterItems(party.reactive, "object", {
      searchTerm: filterOptions.searchTerm,
      searchDescription: filterOptions.searchDescription,
    }).filter((item) => !item.system.containerId),
  );

  let categorizedItems = $derived(groupItemsByType(items, "objectType"));
  let showDescription = $state(false);
  let showUses = $state(false);
  let showQuantity = $state(true);
  let showWeight = $state(false);
  let objectTypes = Object.entries(CONFIG.A5E.objectTypes) as string[][];

  // Base vars
  let members = $derived(party.reactive.members);
  let partyWealth = $derived(party.wealth);
</script>

<div class="a5e-party-sheet__stash">
  <aside class="a5e-party-sheet__stash-aside">
    <!-- Party Total -->
    <div class="a5e-party-sheet__stash__party-total">
      <header>Party Total</header>

      <div class="a5e-party-sheet__stash__party-total__data">
        <div class="a5e-party-sheet__stash__party-total__elem">
          <span>
            <i class="fa-solid fa-coins"></i>
            Coins
          </span>

          <span>{partyWealth.coins.toLocaleString()}</span>
        </div>

        <div class="a5e-party-sheet__stash__party-total__elem">
          <span>
            <i class="fa-solid fa-gem"></i>
            Wealth
          </span>

          <span>{partyWealth.wealth.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <!-- Each Member Total -->
    {#each members as actor}
      <div class="a5e-party-sheet__stash__member-total">
        <header>{actor.name}</header>

        <div class="a5e-party-sheet__stash__member-total__data">
          <img
            style="grid-area: img;"
            src={actor.reactive.img}
            alt={actor.reactive.name}
          />

          <div>
            <div>
              <i class="fa-solid fa-coins"></i>
              <span>{actor.wealth.coins.toLocaleString()}</span>
            </div>

            <div>
              <i class="fa-solid fa-gem"></i>
              <span>{actor.wealth.wealth.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </aside>

  <section class="a5e-party-sheet__stash-inventory">
    <!-- Currency -->
    <div>
      <!-- Coins -->
      <div></div>

      <!-- Wealth -->
      <div></div>
    </div>

    <!-- Inventory -->
    <div class="a5e-party-sheet__stash-inventory__items">
      <UtilityBar
        bind:filterOptions
        showAddIcon={true}
        addIconOptions={objectTypes}
        showDescriptionButton={true}
        bind:showDescription
        onAddIconClick={(subType) => createItem(party, "object", subType)}
      />

      <section class="a5e-page-wrapper a5e-page-wrapper--item-list">
        {#each Object.entries(categorizedItems) as [label, itemList], idx}
          {#if itemList.length > 0}
            <ItemCategory
              {label}
              {showDescription}
              {showQuantity}
              {showUses}
              {showWeight}
              items={itemList}
              type="objectTypesPlural"
            />
          {/if}
        {/each}
      </section>
    </div>
  </section>
</div>

<style lang="scss"></style>
