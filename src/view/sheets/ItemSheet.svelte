<script lang="ts">
  import { setContext } from "svelte";
  import { type ItemA5e } from "#documents/item/item.ts";

  import ItemSideBar from "./components/item/ItemSideBar.svelte";

  type Props = {
    item: ItemA5e;
    sheet: any;
    editable: boolean;
  };

  let { item, sheet, editable }: Props = $props();

  let itemData = $derived(item.reactive.system);
  let canEdit = $derived(editable || game.user?.isGM);

  setContext("item", item);
  setContext("sheet", sheet);
</script>

<div class="a5e-item-sheet">
  <aside class="a5e-item-sheet__aside">
    <ItemSideBar />
  </aside>

  <main class="a5e-item-sheet__main">
    <header></header>

    <nav></nav>

    <section class="a5e-item-sheet__page"></section>
  </main>
</div>

<style lang="scss">
  .a5e-item-sheet {
    display: grid;
    grid-template-columns: 2fr 4fr;
    gap: 0.5rem;
    height: 100%;

    &__aside {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-inline: 0.5rem;
    }

    &__main {
      position: relative;
      width: 100%;
      height: 100%;

      display: grid;
      grid-template-areas:
        "header"
        "primaryNavigation"
        "secondaryNavigation"
        "page";
      grid-template-rows: min-content min-content min-content minmax(0, 1fr);
      gap: 0.5rem;

      &__page {
        grid-area: page;
        overflow-y: auto;
        padding-inline: 0.5rem;
      }
    }
  }
</style>
