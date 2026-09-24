<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import GroupToggleHeading from "./GroupToggleHeading.svelte";

  import {
    getGroupSelectionState,
    toggleGroupInList,
    type ProductSourceTree,
  } from "#utils/prepareProductSourceTree.ts";

  type Props = {
    hint?: string;
    tree: ProductSourceTree;
    selected: string[];
    onUpdateSelection?: (value: string[]) => void;
  };

  let { hint = "", tree, selected, onUpdateSelection = () => {} }: Props = $props();

  function toggleGroup(keys: string[]) {
    onUpdateSelection(toggleGroupInList(keys, selected));
  }
</script>

<div class="a5e-grouped-source-list">
  {#if tree.ungrouped.length}
    <CheckboxGroup options={tree.ungrouped} {selected} {onUpdateSelection} />
  {/if}

  {#each tree.publishers as publisher (publisher.key)}
    <section class="a5e-grouped-source-list__publisher">
      <GroupToggleHeading
        variant="publisher"
        label={publisher.label}
        state={getGroupSelectionState(publisher.keys, selected)}
        onToggle={() => toggleGroup(publisher.keys)}
      />

      {#if publisher.standalone.length}
        <CheckboxGroup options={publisher.standalone} {selected} {onUpdateSelection} />
      {/if}

      {#each publisher.productLines as line (line.key)}
        <section class="a5e-grouped-source-list__product-line">
          <GroupToggleHeading
            variant="productLine"
            label={line.label}
            state={getGroupSelectionState(line.keys, selected)}
            onToggle={() => toggleGroup(line.keys)}
          />

          <CheckboxGroup options={line.options} {selected} {onUpdateSelection} />
        </section>
      {/each}
    </section>
  {/each}
</div>

{#if hint}
  <p class="a5e-hint">{hint}</p>
{/if}

<style lang="scss">
  .a5e-grouped-source-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    &__publisher {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    &__product-line {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      margin-left: 0.75rem;
      padding-left: 0.5rem;
      border-left: 1px solid var(--a5e-border-color);
    }
  }

  .a5e-hint {
    margin-top: 0.25rem;
    color: #555;
    font-size: var(--a5e-xs-text);
  }
</style>
