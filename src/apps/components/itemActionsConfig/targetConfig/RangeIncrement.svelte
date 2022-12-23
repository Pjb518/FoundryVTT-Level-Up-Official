<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import getOrdinalNumber from "../../../../modules/utils/getOrdinalNumber";
  import isStandardRange from "../../../../modules/utils/isStandardRange";

  import FormSection from "../../itemPropertiesConfig/FormSection.svelte";

  export let index;
  export let range;

  const item = getContext("item");
  const actionId = getContext("appId");

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
</script>

<FormSection {heading}>
  <div class="u-flex u-flex-wrap u-gap-md u-pos-relative u-w-full">
    <ul
      class="u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full"
    >
      {#each options as [value, label]}
        <li
          class="a5e-tag u-pointer"
          class:a5e-tag--inactive={!(value === range)}
        >
          {localize(label)}
        </li>
      {/each}
    </ul>

    {#if range === "other"}
      <div class="u-align-center u-flex u-gap-md u-w-full">
        <input type="text" />
      </div>
    {/if}
  </div>
</FormSection>
