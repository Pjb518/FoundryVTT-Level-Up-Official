<script lang="ts">
  import { getContext } from "svelte";
  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { prepareConditionImmunities } from "#utils/view/helpers/prepareConditionImmunities.ts";
  import { prepareCreatureSize } from "#utils/view/helpers/prepareCreatureSize.ts";
  import { prepareDamageImmunities } from "#utils/view/helpers/prepareDamageImmunities.ts";

  import Tag from "#view/snippets/Tag.svelte";

  type Speed = "walk" | "journey";

  const impulseSpeeds = ["slow", "average", "fast"] as const;

  let actor: any = getContext("actor");
  let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

  let system = $derived(actor.reactive.system);
  let isSpace = $derived(system.details.terrain === "space");
  let editable = $derived(actor.isOwner && !sheetIsLocked());

  let speeds = $derived(
    (isSpace
      ? []
      : [
          { key: "walk", label: "A5E.vehicle.movementSpeed" },
          { key: "journey", label: "A5E.vehicle.journeySpeed" },
        ]) as { key: Speed; label: string }[],
  );

  let tagSections = $derived([
    {
      heading: localize("A5E.traits.size.title"),
      values: prepareCreatureSize(actor.reactive),
      onConfigure: () => actor.configureSizeCategory(),
      tooltip: "Configure Size Category",
    },
    {
      heading: localize("A5E.traits.headings.damage.immunities"),
      values: prepareDamageImmunities(actor.reactive),
      onConfigure: () => actor.configureDamageImmunities(),
      tooltip: "Configure Damage Immunities",
    },
    {
      heading: localize("A5E.traits.headings.conditions.immunities"),
      values: prepareConditionImmunities(actor.reactive),
      onConfigure: () => actor.configureConditionImmunities(),
      tooltip: "Configure Condition Immunities",
    },
    {
      heading: localize("A5E.vehicle.specialProperties"),
      values: (system.details.specialProperties ?? []).map((property: string) =>
        localize(CONFIG.A5E.vehicleProperties[property] ?? property),
      ),
      onConfigure: () => actor.configureVehicleProperties(),
      tooltip: "Configure Special Properties",
    },
  ]);

  function update(key: string, value: unknown) {
    updateDocumentDataFromField(actor, key, value);
  }
</script>

<!-- Terrain -->
<div class="a5e-vehicle-details__section">
  <span class="a5e-vehicle-details__heading">
    {localize("A5E.vehicle.terrain")}:
  </span>

  {#if editable}
    <select
      class="a5e-input a5e-input--slim"
      name="system.details.terrain"
      value={system.details.terrain}
      onchange={({ currentTarget }) => update(currentTarget.name, currentTarget.value)}
    >
      {#each Object.entries(CONFIG.A5E.vehicleTypes) as [terrain, terrainLabel]}
        <option value={terrain}>
          {localize(terrainLabel as string)}
        </option>
      {/each}
    </select>
  {:else}
    <ul class="a5e-vehicle-details__values">
      <Tag
        label={localize(CONFIG.A5E.vehicleTypes[system.details.terrain])}
        value={system.details.terrain}
        tight={true}
        displayOnly={true}
        --a5e-tag-background-color="var(--a5e-actor-sidebar-pill-color)"
        --a5e-tag-border-color="var(--a5e-actor-sidebar-pill-border)"
      />
    </ul>
  {/if}
</div>

<!-- Size, immunities -->
{#each tagSections as { heading, values, onConfigure, tooltip }}
  {#if values.length || editable}
    <div class="a5e-vehicle-details__section">
      <div class="a5e-vehicle-details__header">
        <span class="a5e-vehicle-details__heading">{heading}:</span>

        {#if editable}
          <button
            type="button"
            class="a5e-button a5e-button--config"
            aria-label={tooltip}
            data-tooltip={tooltip}
            onclick={onConfigure}
          >
            <i class="fa-solid fa-cog"></i>
          </button>
        {/if}
      </div>

      <ul class="a5e-vehicle-details__values">
        {#each values as value}
          <Tag
            label={value}
            {value}
            tight={true}
            displayOnly={true}
            optionStyles="max-width: 98%; border: 1px solid var(--a5e-border-color);"
            --a5e-tag-background-color="var(--a5e-actor-sidebar-pill-color)"
            --a5e-tag-border-color="var(--a5e-actor-sidebar-pill-border)"
          />
        {/each}
      </ul>
    </div>
  {/if}
{/each}

<!-- Impulse speed -->
{#if isSpace}
  <div
    class="a5e-vehicle-details__section"
    class:a5e-vehicle-details__section--inline={editable}
  >
    <span class="a5e-vehicle-details__heading">
      {localize("A5E.vehicle.impulseSpeed")}:
    </span>

    {#if editable}
      <select
        class="a5e-input a5e-input--slim a5e-vehicle-details__impulse"
        name="system.attributes.movement.impulse"
        value={system.attributes.movement.impulse}
        onchange={({ currentTarget }) => update(currentTarget.name, currentTarget.value)}
      >
        {#each impulseSpeeds as speed}
          <option value={speed}>{localize(`A5E.vehicle.impulse.${speed}`)}</option>
        {/each}
      </select>
    {:else}
      <span class="a5e-vehicle-details__text">
        {localize(`A5E.vehicle.impulse.${system.attributes.movement.impulse}`)}
      </span>
    {/if}
  </div>
{/if}

<!-- Speeds -->
{#each speeds as { key, label }}
  {@const speed = system.attributes.movement[key]}

  {#if speed.distance || editable}
    <div
      class="a5e-vehicle-details__section"
      class:a5e-vehicle-details__section--inline={editable}
    >
      <span class="a5e-vehicle-details__heading">{localize(label)}:</span>

      {#if editable}
        <div class="a5e-vehicle-details__speed">
          <input
            class="a5e-input a5e-input--slim"
            type="number"
            min="0"
            name="system.attributes.movement.{key}.distance"
            value={speed.distance}
            onchange={({ currentTarget }) =>
              update(currentTarget.name, Number(currentTarget.value))}
          />

          <select
            class="a5e-input a5e-input--slim"
            name="system.attributes.movement.{key}.unit"
            value={speed.unit}
            onchange={({ currentTarget }) =>
              update(currentTarget.name, currentTarget.value)}
          >
            {#each Object.entries(CONFIG.A5E.distanceAbbreviations) as [unit, unitLabel]}
              <option value={unit}>{localize(unitLabel as string)}</option>
            {/each}
          </select>
        </div>
      {:else}
        <span class="a5e-vehicle-details__text">
          {`${speed.distance} ${localize(CONFIG.A5E.distanceAbbreviations[speed.unit])}`}
        </span>
      {/if}
    </div>
  {/if}
{/each}

<!-- Cost -->
{#if system.details.cost.value || editable}
  <div class="a5e-vehicle-details__section">
    <span class="a5e-vehicle-details__heading">
      {localize("A5E.vehicle.cost")}:
    </span>

    {#if editable}
      <div class="a5e-vehicle-details__speed">
        <input
          class="a5e-input a5e-input--slim"
          type="number"
          min="0"
          name="system.details.cost.value"
          value={system.details.cost.value}
          data-tooltip="Cost Value"
          onchange={({ currentTarget }) =>
            update(currentTarget.name, Number(currentTarget.value))}
        />

        <select
          class="a5e-input a5e-input--slim"
          name="system.details.cost.denomination"
          onchange={({ currentTarget }) =>
            update(currentTarget.name, currentTarget.value)}
        >
          {#each Object.entries(CONFIG.A5E.currencyDenominations) as [id, label]}
            <option value={id} selected={id === system.details.cost.denomination}>
              {label}
            </option>
          {/each}
        </select>
      </div>
    {:else}
      <span class="a5e-vehicle-details__text">
        {`${system.details.cost.value} ${system.details.cost.denomination}`}
      </span>
    {/if}
  </div>
{/if}

<!-- Weight -->
{#if system.weight || editable}
  <div
    class="a5e-vehicle-details__section"
    class:a5e-vehicle-details__section--inline={editable}
  >
    <span class="a5e-vehicle-details__heading">
      {localize("A5E.vehicle.weight")}:
    </span>

    {#if editable}
      <div class="a5e-vehicle-details__weight">
        <input
          class="a5e-input a5e-input--slim a5e-input--small"
          type="number"
          min="0"
          name="system.weight"
          value={system.weight}
          onchange={({ currentTarget }) =>
            update(currentTarget.name, Number(currentTarget.value))}
        />

        <span>{localize("A5E.objects.weightLbs")}</span>
      </div>
    {:else}
      <span class="a5e-vehicle-details__text">
        {`${system.weight} ${localize("A5E.objects.weightLbs")}`}
      </span>
    {/if}
  </div>
{/if}

<style lang="scss">
  .a5e-vehicle-details {
    &__section {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      font-size: var(--a5e-sm-text);
    }

    &__section--inline {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: baseline;
      column-gap: 0.375rem;
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    &__heading {
      font-weight: 600;
    }

    &__values {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;

      margin: 0;
      padding: 0;

      list-style: none;
      font-size: var(--a5e-xs-text);
    }

    &__section--inline &__speed {
      flex: 1 1 6rem;
      min-width: 0;
    }

    &__section--inline &__weight {
      flex: 1 1 4rem;
      min-width: 0;
    }

    &__speed {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25rem;
    }

    &__impulse {
      flex: 1 1 6rem;
      min-width: 0;
    }

    &__weight {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
</style>
