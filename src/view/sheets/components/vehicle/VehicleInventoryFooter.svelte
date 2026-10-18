<script lang="ts">
  import { getContext } from "svelte";
  import evaluateMathExpression from "#utils/evaluateMathExpression.ts";
  import { getVehicleCapacity } from "#utils/getVehicleCapacity.ts";
  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import ActorItemWeightTrack from "../actor/ActorItemWeightTrack.svelte";

  let actor: any = getContext("actor");
  let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

  let actorStore = $derived(actor.reactive.system);

  const useCredits = (game.settings.get("a5e", "useCredits") as boolean) ?? false;

  let bulkyItems = $derived(
    actor.reactive.items.reduce((bulkyCount: number, item: Item) => {
      if (item.system.bulky && item.system.equippedState) bulkyCount += 1;
      return bulkyCount;
    }, 0),
  );

  let supplyItems = $derived(
    actor.reactive.items.reduce((supplyCount: number, item: Item) => {
      if (item.system.supply && item.system.equippedState) {
        supplyCount += item.reactive.system.quantity || 1;
      }

      return supplyCount;
    }, 0),
  );

  let totalSupply = $derived(actorStore.supply + supplyItems);
  let capacity = $derived(getVehicleCapacity(actor.reactive));
  let supplyTooltip = $derived(
    `${localize("A5E.vehicle.maxSupply")}: ${capacity.supply}`,
  );
  let bulkyTooltip = $derived(`${localize("A5E.vehicle.maxBulky")}: ${capacity.bulky}`);
  let flags = $derived(actor.flags?.a5e ?? {});

  let currency: Record<string, number> = $derived(
    Object.entries(actorStore.currency ?? {}).reduce(
      (acc: Record<string, number>, [key, value]) => {
        if (useCredits ? key === "cr" : key !== "cr") {
          acc[key] = (value as number) ?? 0;
        }

        return acc;
      },
      {},
    ),
  );
</script>

{#if flags?.trackInventoryWeight ?? true}
  <ActorItemWeightTrack />
{/if}

<section class="a5e-footer-group--inventory">
  <!-- Supply -->
  <FieldWrapper
    heading="A5E.vehicle.supply"
    --a5e-field-wrapper-direction="row"
    --a5e-field-wrapper-item-alignment="center"
    --a5e-field-wrapper-gap="0.5rem"
    --a5e-field-wrapper-header-width="100%"
  >
    <span data-tooltip={supplyTooltip} data-tooltip-direction="UP">
      <input
        class="a5e-footer-group__input"
        class:disable-pointer-events={!actor.isOwner}
        type="number"
        name="system.supply"
        value={sheetIsLocked() ? totalSupply : actorStore.supply}
        placeholder="0"
        min="0"
        disabled={sheetIsLocked()}
        onchange={({ currentTarget }) =>
          updateDocumentDataFromField(
            actor,
            currentTarget.name,
            Number(currentTarget.value),
          )}
      />
    </span>
  </FieldWrapper>

  <!-- Bulky Items -->
  <FieldWrapper
    heading="Bulky Items"
    --a5e-field-wrapper-direction="row"
    --a5e-field-wrapper-item-alignment="center"
    --a5e-field-wrapper-gap="0.5rem"
    --a5e-field-wrapper-header-width="100%"
  >
    <span
      class="a5e-footer-group__value"
      data-tooltip={bulkyTooltip}
      data-tooltip-direction="UP"
    >
      {bulkyItems}
    </span>
  </FieldWrapper>

  <!-- Currencies -->
  <FieldWrapper
    --a5e-field-wrapper-direction="row"
    --a5e-field-wrapper-item-alignment="center"
    --a5e-field-wrapper-gap="0.5rem"
    --a5e-field-wrapper-wrap="nowrap"
  >
    {#each Object.entries(currency) as [label, value]}
      <div class="a5e-vehicle-footer__currency">
        <label
          class="a5e-vehicle-footer__currency-label"
          for="{actor.id}-currency-{label}"
        >
          {localize(label)}
        </label>

        <input
          class="a5e-input a5e-input--actor-footer"
          class:disable-pointer-events={!actor.isOwner}
          id="{actor.id}-currency-{label}"
          name="system.currency.{label}"
          type="text"
          {value}
          min="0"
          onchange={({ currentTarget }) =>
            updateDocumentDataFromField(
              actor,
              currentTarget.name,
              Number(
                evaluateMathExpression({
                  expression: currentTarget.value,
                  previousValue: value,
                }),
              ),
            )}
        />
      </div>
    {/each}
  </FieldWrapper>
</section>

<style lang="scss">
  .a5e-vehicle-footer {
    &__currency {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }

    &__currency-label {
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 0.125rem;
    }
  }
</style>
