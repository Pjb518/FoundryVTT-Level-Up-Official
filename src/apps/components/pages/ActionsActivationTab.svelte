<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";
  import updateAssociatedValues from "../../handlers/updateAssociatedValues";

  import FormSection from "../FormSection.svelte";

  const item = getContext("item");
  const actionId = getContext("actionId");

  const { abilityActivationTypes, resourceRecoveryOptions, timePeriods } =
    CONFIG.A5E;
  const specialActivationTypes = ["none", "special"];
  const specialTimeTypes = ["instantaneous", "permanent", "special"];

  $: action = $item.system.actions[actionId];
</script>

<header class="section-header">
  <h2>{localize("A5E.ActivationConfiguration")}</h2>
</header>

<FormSection heading="A5E.ItemActivationCost">
  <div class="u-align-center u-flex u-gap-lg u-w-full">
    {#if action.activation?.type && !specialActivationTypes.includes(action.activation?.type)}
      <div class="u-text-center u-text-sm u-w-20">
        <input
          id={`${actionId}-activation-cost`}
          name={`${actionId}-activation-cost`}
          type="number"
          value={action.activation?.cost ?? 1}
          on:change={({ target }) =>
            updateDocumentDataFromField(
              $item,
              `system.actions.${actionId}.activation.cost`,
              Number(target.value)
            )}
        />
      </div>
    {/if}

    <select
      class="u-w-fit"
      name={`system.actions.${actionId}.activation.type`}
      on:change={({ target }) =>
        updateAssociatedValues(
          $item,
          target.name,
          target.value,
          `system.actions.${actionId}.activation.cost`,
          specialActivationTypes
        )}
    >
      <option value="" />
      {#each Object.entries(abilityActivationTypes) as [value, label]}
        <option
          key={value}
          {value}
          selected={action.activation?.type === value}
        >
          {localize(label)}
        </option>
      {/each}
    </select>
  </div>
</FormSection>

{#if action.activation?.type === "reaction"}
  <FormSection heading="A5E.ActionActivationReactionTrigger">
    <div class="u-text-sm u-w-full">
      <input
        type="text"
        name={`system.actions.${actionId}.activation.reactionTrigger`}
        value={action.activation?.reactionTrigger ?? ""}
        on:change={({ target }) =>
          updateDocumentDataFromField($item, target.name, target.value)}
      />
    </div>
  </FormSection>
{/if}

<FormSection heading="A5E.ItemDuration">
  <div class="u-align-center u-flex u-gap-lg u-w-full">
    {#if action?.duration?.unit && !specialTimeTypes.includes(action?.duration?.unit)}
      <div class="u-text-center u-text-sm u-w-20">
        <input
          id={`${actionId}-duration-value`}
          name={`${actionId}-duration-value`}
          type="number"
          value={action.duration?.value ?? 1}
          on:change={({ target }) =>
            updateDocumentDataFromField(
              $item,
              `system.actions.${actionId}.duration.value`,
              Number(target.value)
            )}
        />
      </div>
    {/if}

    <select
      class="u-w-fit"
      name={`system.actions.${actionId}.duration.unit`}
      on:change={({ target }) =>
        updateAssociatedValues(
          $item,
          target.name,
          target.value,
          `system.actions.${actionId}.duration.value`,
          specialTimeTypes
        )}
    >
      <option value="" />
      {#each Object.entries(timePeriods) as [value, label]}
        <option key={value} {value} selected={action?.duration?.unit === value}>
          {localize(label)}
        </option>
      {/each}
    </select>
  </div>
</FormSection>

<!-- ////////////////////////////////////////////////////////////// -->

<header class="section-header">
  <h2>Resource Consumption</h2>
</header>

<FormSection>
  <div class="field-group field-group--label">
    <label for={`${actionId}-resource-label`}> Label </label>

    <input
      id={`${actionId}-resource-label`}
      name={`${actionId}-resource-label`}
      type="text"
      value={action.resource?.label ?? ""}
      on:change={({ target }) =>
        updateDocumentDataFromField(
          $item,
          `system.actions.${actionId}.resource.label`,
          target.value
        )}
    />
  </div>

  <div class="field-group field-group--resource">
    <div class="u-flex u-flex-col u-gap-xs u-w-30">
      <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

      <input
        class="a5e-input"
        type="number"
        name={`system.actions.${actionId}.resource.value`}
        value={action.resource?.value ?? 0}
        on:change={({ target }) =>
          updateDocumentDataFromField($item, target.name, Number(target.value))}
      />
    </div>

    <div class="u-flex u-flex-col u-gap-xs u-w-30">
      <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

      <input
        class="a5e-input"
        type="number"
        name={`system.actions.${actionId}.resource.max`}
        value={action.resource?.max ?? 0}
        on:change={({ target }) =>
          updateDocumentDataFromField($item, target.name, Number(target.value))}
      />
    </div>

    <div class="u-flex u-flex-col u-gap-xs u-w-30">
      <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>

      <select
        class="u-h-8 u-w-40"
        name={`system.actions.${actionId}.resource.per`}
        value={action.resource?.per ?? ""}
        on:change={({ target }) =>
          updateDocumentDataFromField($item, target.name, target.value)}
      >
        <option value="" />

        {#each Object.entries(resourceRecoveryOptions) as [key, name]}
          <option {key} value={key} selected={$item.system.uses.per === key}>
            {localize(name)}
          </option>
        {/each}
      </select>
    </div>
  </div>
</FormSection>

<style lang="scss">
  .none {
    color: #555;
    text-align: center;
    font-size: 1rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.25rem 0.25rem 0.25rem;
    font-family: "Modesto Condensed", serif;
    font-size: 1rem;
    border-bottom: 1px solid #ccc;
  }

  .resource {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    padding: 0.75rem;
    font-size: 0.833rem;
    background-color: rgba(0 0 0 / 0.05);
    border: 1px solid #b2b0ae;
    border-radius: 4px;
    font-size: 1rem;
  }

  .resource-config-list {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    list-style: none;
    font-family: "Modesto Condensed", serif;
  }

  .button--delete {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: #999;
    cursor: pointer;
    transition: all 0.15s ease-in-out;

    &:hover {
      color: #8b2525;
      transform: scale(1.2);
    }
  }

  //   ==========================================================
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--source {
      flex-grow: 1;
    }

    &--label {
      margin-right: 4.5rem;
    }

    &--resource {
      flex-direction: row;
      gap: 0.75rem;
    }

    &__heading {
      font-size: 0.833rem;
    }

    input[type="text"],
    input[type="number"] {
      width: 100%;
    }

    .hint {
      font-size: 0.694rem;
    }
  }
</style>
