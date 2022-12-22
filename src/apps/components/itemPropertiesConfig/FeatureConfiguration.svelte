<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import FormSection from "./FormSection.svelte";
  import RadioGroup from "./RadioGroup.svelte";

  const item = getContext("item");

  let editMode = false;

  function changeEditMode() {
    editMode = !editMode;
  }
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
    on:click={changeEditMode}
  >
    <h3>Feature Properties</h3>
    <i
      class="u-text-sm fas"
      class:fa-chevron-up={editMode}
      class:fa-edit={!editMode}
    />
  </header>

  {#if editMode}
    <div class="u-flex u-flex-col u-gap-md">
      <FormSection heading="A5E.FeatureTypePrompt">
        <!-- svelte-ignore missing-declaration -->
        <RadioGroup
          options={Object.entries(CONFIG.A5E.featureTypes)}
          selected={$item.system.featureType}
          name="system.featureType"
        />
      </FormSection>
    </div>
  {/if}
</section>
