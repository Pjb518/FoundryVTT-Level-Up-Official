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

<section class="action-config action-config__wrapper">
  <section class="action-config action-config__section">
    <header class="action-config__section-header">
      <h2>{localize("A5E.ActivationConfiguration")}</h2>
    </header>

    <FormSection heading="A5E.ItemActivationCost">
      <div class="action-config__component">
        {#if action.activation?.type && !specialActivationTypes.includes(action.activation?.type)}
          <input
            class="small-input"
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
        <div class="action-config__component">
          <input
            class="full-size-input"
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
      <div class="action-config__component">
        {#if action?.duration?.unit && !specialTimeTypes.includes(action?.duration?.unit)}
          <input
            class="small-input"
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
            <option
              key={value}
              {value}
              selected={action?.duration?.unit === value}
            >
              {localize(label)}
            </option>
          {/each}
        </select>
      </div>
    </FormSection>
  </section>

  <section class="action-config action-config__section">
    <header class="action-config__section-header">
      <h2>{localize("A5E.Uses")}</h2>
    </header>

    <FormSection>
      <div class="action-config__component">
        <input
          id={`${actionId}-prefer-action-uses`}
          name={`${actionId}-prefer-action-uses`}
          type="checkbox"
          checked={action.uses?.preferAction ?? false}
          on:change={({ target }) =>
            updateDocumentDataFromField(
              $item,
              `system.actions.${actionId}.uses.preferAction`,
              target.checked
            )}
        />

        <label for={`${actionId}-prefer-action-uses`}>
          {localize("A5E.UsesUseActionUses")}
        </label>
      </div>
    </FormSection>

    {#if action.uses?.preferAction}
      <FormSection>
        <div class="action-config__component">
          <div class="label">
            <label for={`${actionId}-uses-label`}>
              {localize("A5E.Label")}
            </label>

            <input
              id={`${actionId}-uses-label`}
              name={`${actionId}-uses-label`}
              type="text"
              value={action.uses?.label ?? ""}
              on:change={({ target }) =>
                updateDocumentDataFromField(
                  $item,
                  `system.actions.${actionId}.uses.label`,
                  target.value
                )}
            />
          </div>

          <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{localize("A5E.UsesCurrent")}</h3>

            <input
              class="a5e-input"
              type="number"
              name={`system.actions.${actionId}.uses.value`}
              value={action.uses?.value ?? 0}
              on:change={({ target }) =>
                updateDocumentDataFromField(
                  $item,
                  target.name,
                  Number(target.value)
                )}
            />
          </div>

          <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{localize("A5E.UsesMax")}</h3>

            <input
              class="a5e-input"
              type="number"
              name={`system.actions.${actionId}.uses.max`}
              value={action.uses?.max ?? 0}
              on:change={({ target }) =>
                updateDocumentDataFromField(
                  $item,
                  target.name,
                  Number(target.value)
                )}
            />
          </div>

          <div class="u-flex u-flex-col u-gap-xs u-w-30">
            <h3 class="u-text-sm">{localize("A5E.UsesPer")}</h3>

            <select
              class="u-h-8 u-w-40"
              name={`system.actions.${actionId}.uses.per`}
              value={action.uses?.per ?? ""}
              on:change={({ target }) =>
                updateDocumentDataFromField($item, target.name, target.value)}
            >
              <option value="" />

              {#each Object.entries(resourceRecoveryOptions) as [key, name]}
                <option
                  {key}
                  value={key}
                  selected={$item.system.uses.per === key}
                >
                  {localize(name)}
                </option>
              {/each}
            </select>
          </div>
        </div>
      </FormSection>
    {/if}
  </section>
</section>
