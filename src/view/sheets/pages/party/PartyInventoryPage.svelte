<script lang="ts">
  import { getContext } from "svelte";
  import createItem from "#utils/createItem.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { filterItems } from "#utils/view/filterItems.ts";
  import { groupItemsByType } from "#utils/view/groupItemsByType.ts";
  import ItemCategory from "#view/sheets/components/ItemCategory.svelte";
  import UtilityBar from "#view/snippets/UtilityBar.svelte";

  function getCoins() {
    const coins = party.reactive.coins;

    if (game.settings.get("a5e", "useCredits")) {
      Object.keys(coins ?? {}).forEach((c) => {
        if (c !== "cr") return;
        delete coins[c];
      });
    } else delete coins.cr;
    return coins;
  }

  function getPartyInventoryWealth() {
    const config = CONFIG.A5E.currencyToGold;

    const coins = Object.entries(getCoins() ?? {}).reduce(
      (acc, [curr, val]) => {
        return acc + (config[curr]?.(val ?? 0) ?? 0);
      },
      0,
    );

    const wealth = party.reactive.itemTypes.object.reduce((acc, obj) => {
      if (obj.system.price.special) return acc;
      const denom = obj.system.price.denomination;
      const goldValue = config[denom]?.(obj.system.price.value ?? 0) ?? 0;
      return acc + goldValue;
    }, 0);

    return { coins, wealth };
  }

  function updateCurrency(denom: string, v: string) {
    const value = Number.parseInt(v, 10);
    const current = party.system.currency[denom] ?? 0;
    const updated = Math.max(current + value, 0);
    updateDocumentDataFromField(party, `system.currency.${denom}`, updated);
  }

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
  let coins = $derived(getCoins());
  let partyWealth = $derived(party.reactive.wealth);
  let partyInventoryWealth = $derived(getPartyInventoryWealth());
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
    <div class="a5e-party-sheet__stash__coins">
      <header class="a5e-party-sheet__stash__coins__header">
        <span>Coins</span>
        <i
          class="fa-solid fa-info-circle"
          data-tooltip="Currency can only be increased or decreased, not directly set."
          data-tooltip-direction="UP"
        ></i>
      </header>

      <!-- Coins -->
      <div class="a5e-party-sheet__stash__coins__currency">
        {#each Object.entries(coins) as [denom, value]}
          <div class="a5e-party-sheet__stash__coins__coin">
            <span>{denom}</span>

            <input
              class="a5e-input a5e-input--slim a5e-input--small"
              type="number"
              value={party.reactive.system.currency[denom] ?? 0}
              onfocus={({ currentTarget }) => (currentTarget.value = "")}
              onblur={({ currentTarget }) => (currentTarget.value = `${value}`)}
              onchange={({ currentTarget }) =>
                updateCurrency(denom, currentTarget.value)}
            />
          </div>
        {/each}

        <button
          type="button"
          class="a5e-button a5e-button--transparent a5e-party-sheet__stash__coins__distribute"
          aria-label="Distribute Coins"
          data-tooltip="Distribute Coins"
          data-tooltip-direction="UP"
          onclick={() => party.distributeCoins()}
        >
          <i class="fa-solid fa-share"></i>
        </button>
      </div>

      <!-- Wealth -->
      <div class="a5e-party-sheet__stash__coins__wealth">
        <div class="a5e-party-sheet__stash__coins__wealth--currency">
          <i class="fa-solid fa-coins"></i>
          <span>Total Coins</span>
          <span>{partyInventoryWealth.coins.toLocaleString()}</span>
        </div>

        <div class="a5e-party-sheet__stash__coins__wealth--wealth">
          <i class="fa-solid fa-gem"></i>
          <span>Total Wealth</span>
          <span>{partyInventoryWealth.wealth.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <hr />

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
