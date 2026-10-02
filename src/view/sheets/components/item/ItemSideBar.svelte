<script lang="ts">
  import { getContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";

  let item: ItemA5e = getContext("item");

  let itemData = $derived(item.reactive.system);
</script>

<img class="a5e-item-sheet__image" src={item.reactive.img} alt={item.reactive.name} />

<style lang="scss">
  .a5e-item-sheet {
    &__image {
      width: 100%;
      aspect-ratio: 1/1;
      border-radius: 0.25rem;
    }
  }
</style>
