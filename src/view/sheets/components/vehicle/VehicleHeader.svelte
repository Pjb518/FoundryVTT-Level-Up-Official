<script lang="ts">
  import { getContext } from "svelte";

  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import AbilityScore from "../AbilityScore.svelte";
  import VehicleDriver from "./VehicleDriver.svelte";
  import VehicleHeaderShields from "./VehicleHeaderShields.svelte";

  const abilityKeys = ["str", "dex", "con"];

  let actor: any = getContext("actor");

  let system = $derived(actor.reactive.system);
  let name = $derived(actor.reactive.name);
  let isSpace = $derived(system.details.terrain === "space");

  const isFromDriver = (key: string) =>
    key === "dex" || (isSpace && ["str", "con"].includes(key));
</script>

<header class="actor-sheet-header">
  <section class="actor-sheet-header-top">
    <section class="actor-sheet-header-top-left">
      <input
        type="text"
        value={name}
        class="a5e-input a5e-input--character-name"
        class:disable-pointer-events={!actor.isOwner}
        placeholder="Name"
        spellcheck="false"
        autocomplete="off"
        onchange={({ currentTarget }) =>
          updateDocumentDataFromField(actor, "name", currentTarget.value)}
      />
    </section>

    <VehicleHeaderShields />
  </section>

  <ul class="a5e-ability-scores">
    {#each abilityKeys as abilityKey, idx}
      <AbilityScore
        ability={system.abilities[abilityKey]}
        {abilityKey}
        {idx}
        fromDriver={isFromDriver(abilityKey)}
      />
    {/each}

    <!-- The driver takes the remaining columns, in line with the scores -->
    <li class="a5e-vehicle-driver-slot">
      <VehicleDriver />
    </li>
  </ul>
</header>

<style lang="scss">
  .a5e-vehicle-driver-slot {
    grid-column: span 3;
    list-style: none;
  }

  .actor-sheet-header {
    display: flex;
    flex-direction: column;
    height: fit-content;
    gap: 0.5rem;
    margin-block: 0.5rem;
    margin-inline: 0.25rem;

    &-top {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 0.5rem;
    }

    &-top-left {
      display: flex;
      flex-grow: 1;
      align-items: center;
      margin-left: 0.25rem;
    }
  }
</style>
