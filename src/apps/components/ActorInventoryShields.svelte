<script>
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
  import { getContext } from "svelte";
  import { each } from "svelte/internal";

  import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

  const actor = getContext("actor");

  $: attunement = $actor.system.attributes.attunement;
  $: currency = $actor.system.currency;
  $: supply = $actor.system.supply;
  $: sheetIsLocked = $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

{#if $actor.type === "character"}
  <!-- Attunement -->
  <div class="shield-container shield-container--attunement">
    <h3 class="footer-shield-header">
      {localize("A5E.Attunement")}
    </h3>
    <span class="a5e-footer-group__value a5e-footer-group__value--attunement">
      {attunement.current}
    </span>
    /
    <input
      class="
				shield-input
				a5e-footer-group__input
			"
      type="number"
      name="system.attributes.attunement.max"
      value={attunement.max}
      placeholder="0"
      min="0"
      max="9"
      on:change={({ target }) =>
        updateDocumentDataFromField($actor, target.name, Number(target.value))}
    />
  </div>

  <!-- Supply -->
  <div class="shield-container shield-container--supply">
    <h3 class="footer-shield-header">
      {localize("A5E.Supply")}
    </h3>

    <input
      class="shield-input a5e-footer-group__input"
      type="number"
      name="system.supply"
      value={supply}
      placeholder="0"
      min="0"
      on:change={({ target }) =>
        updateDocumentDataFromField($actor, target.name, Number(target.value))}
    />
  </div>
{/if}

<!-- Currencies -->
<div
  class="
		u-flex u-gap-sm u-text-sm
		shield-container
		shield-container--currency
	"
  class:u-ml-auto={$actor.type === "npc"}
>
  <h3 class="footer-shield-header">
    {localize("A5E.Currency")}
  </h3>

  <ol class="currency-list">
    {#each Object.entries(currency) as [label, value]}
      <li class="" data-type={label}>
        <label class="currency-label" for="currency-{label}">
          {label}
        </label>

        <input
          class="
						a5e-footer-group__input
						a5e-footer-group__input--currency
						shield-input
					"
          id="currency-{label}"
          type="number"
          name="system.cuurency.{label}"
          {value}
          min="0"
        />
      </li>
    {/each}
  </ol>
</div>

<style lang="scss">
  .shield-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;

    &--currency {
      flex: 0 0 33%;
    }
  }

  .footer-shield-header {
    flex: 0 0 100%;
    text-align: center;
    font-size: 1rem;
  }

  .currency-list {
    display: flex;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;

    .currency-label {
      width: 100%;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 0;
    }
  }
</style>
