<script>
  import { getContext } from "svelte";

  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
</script>

<header class="sheet-header">
  <img class="item-image" src={$item.img} alt={$item.name} title={$item.name} />

  <input
    type="text"
    name="name"
    value={$item.name}
    class="item-name"
    placeholder="Name"
    on:change={({ target }) =>
      updateDocumentDataFromField($item, target.name, target.value)}
  />
  {#if $item.system.broken}
    <i class="broken-item-icon fa-solid fa-heart-crack" data-tooltip="A5E.BrokenItem" data-tooltip-direction="DOWN"></i>
  {/if}
</header>

<style lang="scss">
  .broken-item-icon {
    font-size: 2.25rem;
    color: #8b2525;
    padding-right: 1rem;
  }

  .sheet-header {
    display: flex;
    align-items: center;
  }

  .item-image {
    width: 3rem;
    height: 3rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .item-name,
  .item-name[type="text"] {
    font-family: "Modesto Condensed", serif;
    font-size: 1.728rem;
    border: 0;
    background: transparent;

    &:active,
    &:focus {
      box-shadow: none;
    }
  }
</style>
