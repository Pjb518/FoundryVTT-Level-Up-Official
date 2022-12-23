<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import FormSection from "./FormSection.svelte";
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import RadioGroup from "./RadioGroup.svelte";

  const item = getContext("item");

  let editMode = false;

  function toggleEditMode() {
    editMode = !editMode;
  }

  const armorProperties = CONFIG.A5E.armorProperties;
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
    <h3>{localize("Armor Configuration")}</h3>
    <i
      class="u-text-sm fas"
      class:fa-chevron-up={editMode}
      class:fa-edit={!editMode}
    />
  </header>

  {#if editMode}
    <div class="u-flex u-flex-col u-gap-md">
      <FormSection heading="A5E.ArmorCategory">
        <!-- svelte-ignore missing-declaration -->
        <RadioGroup
          options={Object.entries(CONFIG.A5E.armor)}
          selected={$item.system.armorCategory}
          name="system.armorCategory"
        />
      </FormSection>

      <FormSection heading="A5E.ArmorProperties">
        <!-- svelte-ignore missing-declaration -->
        <CheckboxGroup
          options={Object.entries(armorProperties)}
          selected={$item.system.armorProperties}
          name="system.armorProperties"
        />
      </FormSection>
    </div>
  {:else}
    <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{localize("A5E.ArmorCategory")}:</dt>
        <dd class="u-m-0 u-p-0">
          <!-- svelte-ignore missing-declaration -->
          {#if $item.system.armorCategory}
            {localize(
              CONFIG.A5E.armor[$item.system.armorCategory] ??
                $item.system.armorCategory
            )}
          {:else}
            {localize("A5E.Unknown")}
          {/if}
        </dd>
      </div>

      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">{localize("A5E.ArmorProperties")}:</dt>
        <dd class="u-m-0 u-p-0">
          {#if $item.system.armorProperties.length}
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
              {#each $item.system.armorProperties.sort((a, b) => a
                  .toLowerCase()
                  .localeCompare(b.toLowerCase())) as property}
                <li key={property}>
                  {localize(armorProperties[property] ?? property)}
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
