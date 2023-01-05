<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  import ActionConsumer from "./ActionConsumer.svelte";

  const item = getContext("item");
  const actionId = getContext("actionId");

  function updateType(event) {
    const selectedOption = event.target?.selectedOptions[0].value;

    $item.update({
      [`system.actions.${actionId}.uses.${consumerId}`]: {
        label: consumer.label ?? "",
        type: selectedOption,
        "-=value": null,
        "-=max": null,
        "-=per": null,
      },
    });
  }

  const consumerTypes = {
    action: "Action",
    item: "Item",
    // resource: "Resource",
  };

  export let consumerId;
  export let consumer;
</script>

<section class="action-config__wrapper">
  <div class="a5e-field-group a5e-field-group--label">
    <label for={`${actionId}-${consumerId}-label`}>
      {localize("A5E.Label")}
    </label>

    <input
      id={`${actionId}-${consumerId}-label`}
      name={`${actionId}-${consumerId}-label`}
      type="text"
      value={consumer.label ?? ""}
      on:change={({ target }) =>
        updateDocumentDataFromField(
          $item,
          `system.actions.${actionId}.uses.${consumerId}.label`,
          target.value
        )}
    />
  </div>

  <div class="option-wrapper">
    <h3>{localize("Type")}</h3>

    <select
      name={`${actionId}-${consumerId}-type`}
      id={`${actionId}-${consumerId}-type`}
      class="u-w-fit"
      on:change={updateType}
    >
      {#each Object.entries(consumerTypes) as [type, label]}
        <option value={type} selected={consumer?.type === type}>
          {localize(label)}
        </option>
      {/each}
    </select>
  </div>

  {#if consumer.type === "action"}
    <ActionConsumer {consumerId} {consumer} />
  {:else if consumer.type === "resource"}
    Resource!
    <!-- else content here -->
  {/if}
</section>

<style lang="scss">
  .option {
    &-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.694rem;
      font-family: "Signika", sans-serif;
    }
  }
</style>
