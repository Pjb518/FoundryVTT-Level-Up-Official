<script lang="ts">
  import { getContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  let item: ItemA5e = getContext("item");

  let itemData = $derived(item.reactive.system);
</script>

<header class="a5e-item-sheet__header">
  <div class="a5e-item-sheet__header__name-wrapper">
    <input
      class="a5e-item-sheet__header__item-name"
      type="text"
      value={item.reactive.name}
      placeholder={_loc("A5E.Name")}
      onchange={({ currentTarget }) =>
        updateDocumentDataFromField(item, "name", currentTarget.value)}
    />
  </div>

  <div class="a5e-item-sheet__header__details-wrapper">Details go here</div>

  <div class="a5e-item-sheet__header__summary__wrapper">Summary go here</div>
</header>

<style lang="scss">
</style>
