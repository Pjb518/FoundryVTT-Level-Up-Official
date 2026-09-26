<script lang="ts">
  import GroupToggleHeading from "./GroupToggleHeading.svelte";
  import MultiStateCheckBoxGroup from "./MultiStateCheckBoxGroup.svelte";

  import {
    getGroupTriState,
    toggleGroupInTriState,
    type ProductSourceTree,
  } from "#utils/prepareProductSourceTree.ts";

  type Props = {
    auxEnabled?: boolean;
    color?: "orange" | "red";
    hint?: string;
    tree: ProductSourceTree;
    selected: [string[], string[]];
    onUpdateSelection?: (newSelections: [string[], string[]]) => void;
  };

  let {
    auxEnabled = true,
    color = "orange",
    hint = "",
    tree,
    selected,
    onUpdateSelection = () => {},
  }: Props = $props();

  function toggleGroup(keys: string[]) {
    onUpdateSelection(toggleGroupInTriState(keys, selected));
  }
</script>

<div class="a5e-grouped-source-list">
  {#if tree.ungrouped.length}
    <MultiStateCheckBoxGroup
      options={tree.ungrouped}
      {selected}
      {color}
      {auxEnabled}
      {onUpdateSelection}
    />
  {/if}

  {#each tree.publishers as publisher (publisher.key)}
    <section class="a5e-grouped-source-list__publisher">
      <GroupToggleHeading
        variant="publisher"
        label={publisher.label}
        state={getGroupTriState(publisher.keys, selected[0], selected[1])}
        onToggle={() => toggleGroup(publisher.keys)}
      />

      {#if publisher.standalone.length}
        <MultiStateCheckBoxGroup
          options={publisher.standalone}
          {selected}
          {color}
          {auxEnabled}
          {onUpdateSelection}
        />
      {/if}

      {#each publisher.productLines as line (line.key)}
        <section class="a5e-grouped-source-list__product-line">
          <GroupToggleHeading
            variant="productLine"
            label={line.label}
            state={getGroupTriState(line.keys, selected[0], selected[1])}
            onToggle={() => toggleGroup(line.keys)}
          />

          <MultiStateCheckBoxGroup
            options={line.options}
            {selected}
            {color}
            {auxEnabled}
            {onUpdateSelection}
          />
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
