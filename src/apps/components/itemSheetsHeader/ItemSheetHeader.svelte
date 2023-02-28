<script>
  import { getContext } from "svelte";

  import editDocumentImage from "../../handlers/editDocumentImage";
  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const hasType = ["maneuver", "feature"];
</script>

<header class="sheet-header">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    class="item-image"
    src={$item.img}
    alt={$item.name}
    title={$item.name}
    on:click={() => editDocumentImage($item)}
  />

  <div>
    <input
      type="text"
      name="name"
      value={$item.name}
      class="item-name"
      placeholder="Name"
      on:change={({ target }) =>
        updateDocumentDataFromField($item, target.name, target.value)}
    />
    {#if hasType.includes($item.type)}
      <div class="prerequisites" style="display:flex; align-items:center">
        <label class="prerequisite-label" for="prerequisites"
          >Prerequisites:
        </label>
        <input
          id="prerequisites"
          type="text"
          name="system.prerequisite"
          value={$item.system.prerequisite || null}
          class="item-prerequisite"
          placeholder="None"
          on:change={({ target }) =>
            updateDocumentDataFromField($item, target.name, target.value)}
        />
      </div>
    {/if}
  </div>
  {#if $item.system.broken}
    <i
      class="broken-item-icon fa-solid fa-heart-crack"
      data-tooltip="A5E.BrokenItem"
      data-tooltip-direction="DOWN"
    />
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

  .item-prerequisite,
  .item-prerequisite[type="text"] {
    border: 0;
    background: transparent;

    &:active,
    &:focus {
      box-shadow: none;
    }
  }

  .prerequisite-label {
    padding-inline: 0.5rem 0rem;
    &:active,
    &:focus {
      box-shadow: none;
    }
  }

  .prerequisites {
    display: flex;
    align-items: center;
    font-family: "Modesto Condensed", serif;
    font-size: 1rem;
    align-items: center;
  }
</style>
