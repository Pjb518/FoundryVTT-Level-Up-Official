<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import FormSection from "./FormSection.svelte";
  import CheckboxGroup from "./CheckboxGroup.svelte";

  const item = getContext("item");

  let editMode = false;

  function toggleEditMode() {
    editMode = !editMode;
  }

  const materialProperties = CONFIG.A5E.materialProperties;
</script>

<section>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <header
    class="
            u-align-center
            u-flex
            u-fot-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
    on:click={toggleEditMode}
  >
    <h3>{localize("A5E.MaterialProperties")}</h3>
    <i
      class="u-text-sm fas"
      class:fa-chevron-up={editMode}
      class:fa-edit={!editMode}
    />
  </header>

  {#if editMode}
    <div class="u-flex u-flex-col u-gap-md">
      <FormSection heading="A5E.MaterialProperties">
        <!-- svelte-ignore missing-declaration -->
        <CheckboxGroup
          options={Object.entries(materialProperties)}
          selected={$item.system.materialProperties}
          name="system.materialProperties"
        />
      </FormSection>
    </div>
  {:else}
    <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{localize("A5E.MaterialProperties")}:</dt>
        <dd class="u-m-0 u-p-0">
          {#if $item.system.materialProperties.length}
            <ul
              class="
              u-comma-list
              u-flex
              u-flex-shrink-0
              u-gap-ch
              u-list-style-none
              u-m-0
              u-p-0
              u-w-fit
            "
            >
              {#each $item.system.materialProperties.sort((a, b) => a
                  .toLowerCase()
                  .localeCompare(b.toLowerCase())) as property}
                <li key={property}>
                  {localize(materialProperties[property] ?? property)}
                </li>
              {/each}
            </ul>
          {:else}
            {localize("A5E.None")}
          {/if}
        </dd>
      </div>
    </dl>
  {/if}
</section>
