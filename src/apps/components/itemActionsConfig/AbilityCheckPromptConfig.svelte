<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const actionId = getContext("actionId");

  const { abilities } = CONFIG.A5E;

  export let prompt;
  export let promptId;
</script>

<div class="field-group field-group--label">
  <label for={`${actionId}-${promptId}-label`}>Label</label>

  <input
    id={`${actionId}-${promptId}-label`}
    name={`${actionId}-${promptId}-label`}
    type="text"
    value={prompt.label ?? ""}
    on:change={({ target }) =>
      updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.prompts.${promptId}.label`,
        target.value
      )}
  />
</div>

<div class="field-group">
  <h3 class="field-group__heading">{localize("A5E.ItemAbilityCheckType")}</h3>

  <div class="option-list">
    <input
      class="option-input"
      type="radio"
      name={`${actionId}-${promptId}-ability`}
      id={`${actionId}-${promptId}-ability-none`}
      value=""
      checked={(prompt.ability ?? true) || prompt.ability === ""}
      on:change={() =>
        updateDocumentDataFromField(
          $item,
          `system.actions.${actionId}.prompts.${promptId}`,
          { "-=ability": null }
        )}
    />

    <label class="option-label" for={`${actionId}-${promptId}-ability-none`}>
      {localize("A5E.None")}
    </label>

    {#each Object.entries(abilities) as [ability, label]}
      <input
        class="option-input"
        type="radio"
        name={`${actionId}-${promptId}-ability`}
        id={`${actionId}-${promptId}-ability-${ability}`}
        value={ability}
        checked={prompt.ability === ability}
        on:change={({ target }) =>
          updateDocumentDataFromField(
            $item,
            `system.actions.${actionId}.prompts.${promptId}.ability`,
            target.value
          )}
      />

      <label
        class="option-label"
        for={`${actionId}-${promptId}-ability-${ability}`}
      >
        {localize(label)}
      </label>
    {/each}
  </div>
</div>

<div class="field-group field-group--formula">
  <label for={`${actionId}-${promptId}-dc`}>
    {localize("A5E.ItemAbilityCheckDC")}
  </label>

  <input
    id={`${actionId}-${promptId}-dc`}
    name={`${actionId}-${promptId}-dc`}
    type="text"
    value={prompt.abilityDC ?? ""}
    on:change={({ target }) =>
      updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.prompts.${promptId}.abilityDC`,
        target.value
      )}
  />
</div>

<div class="field-group ">
  <label for={`${actionId}-${promptId}-save-effect`}>
    {localize("A5E.ItemEffectOnCheck")}
  </label>

  <input
    id={`${actionId}-${promptId}-save-effect`}
    name={`${actionId}-${promptId}-save-effect`}
    type="text"
    value={prompt.onSave ?? ""}
    on:change={({ target }) =>
      updateDocumentDataFromField(
        $item,
        `system.actions.${actionId}.prompts.${promptId}.onSave`,
        target.value
      )}
  />
</div>

<style lang="scss">
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    &--formula {
      flex-grow: 1;
    }

    &--label {
      margin-right: 4.5rem;
    }

    &__heading {
      font-size: 0.833rem;
    }

    input[type="text"] {
      width: 100%;
    }
  }

  //   .hint {
  //     font-size: 0.694rem;
  //   }

  .option {
    &-input {
      display: none;

      &:checked + .option-label {
        background: #2b6537;
        border-color: darken($color: #2b6537, $amount: 5);
        color: #f6f2eb;
      }
    }

    &-label {
      border-radius: 3px;
      border: 1px solid #bbb;
      padding: 0.125rem 0.25rem;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      font-size: 0.694rem;
    }
  }
</style>
