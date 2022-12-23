<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import getOrdinalNumber from "../../../../modules/utils/getOrdinalNumber";
  import isStandardRange from "../../../../modules/utils/isStandardRange";

  import FormSection from "../../itemPropertiesConfig/FormSection.svelte";
  import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

  export let index;
  export let id;
  export let range;

  const item = getContext("item");
  const actionId = getContext("actionId");

  function update(option) {
    range = isStandardRange(option) ? option : customValue;
    updateDocumentDataFromField(
      $item,
      `system.actions.${actionId}.ranges.${id}.range`,
      range
    );
  }

  const heading = game.i18n.format("A5E.ItemRangeIncrement", {
    increment: getOrdinalNumber(index + 1),
  });

  const options = Object.entries(CONFIG.A5E.rangeDescriptors).map(
    ([value, label]) => {
      if (["short", "medium", "long"].includes(value)) {
        const range = CONFIG.A5E.rangeValues[value];
        return [value, `${game.i18n.localize(label)} (${range} ft.)`];
      }

      return [value, label];
    }
  );

  let customValue = isStandardRange(range) ? "" : range;
  $: selected = isStandardRange(range) ? range : "other";
</script>

<FormSection {heading}>
  <div class="u-flex u-flex-wrap u-gap-md u-pos-relative u-w-full">
    <ul
      class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
    >
      {#each options as [value, label]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class="a5e-tag u-pointer"
          class:a5e-tag--inactive={!(
            selected === value || selected?.toString() === value
          )}
          on:click={() => update(value)}
        >
          {localize(label)}
        </li>
      {/each}
    </ul>

    {#if selected === "other"}
      <div class="u-align-center u-flex u-gap-md u-w-full">
        <input
          type="text"
          bind:value={customValue}
          on:change={() => update(customValue)}
        />
      </div>
    {/if}
  </div>
</FormSection>
