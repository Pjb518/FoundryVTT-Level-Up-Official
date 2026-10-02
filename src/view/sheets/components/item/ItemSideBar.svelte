<script lang="ts">
  import { getContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";
  import { editDocumentImage } from "#utils/view/editDocumentImage.ts";

  let item: ItemA5e = getContext("item");

  let itemData = $derived(item.reactive.system);
</script>

<aside class="a5e-item-sheet__aside">
  <img class="a5e-item-sheet__image" src={item.reactive.img} alt={item.reactive.name} />

  <div class="a5e-item-sheet__aside__properties">
    {#each item.reactive.properties as property}
      <span>{property}</span>
    {/each}
  </div>

  <div>Action Summary goes here</div>
</aside>

<style lang="scss">
  .a5e-item-sheet {
    &__aside {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-inline: 0.5rem;

      &__properties {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
    }

    &__image {
      width: 100%;
      aspect-ratio: 1/1;
      border-radius: 0.25rem;
    }
  }
</style>
