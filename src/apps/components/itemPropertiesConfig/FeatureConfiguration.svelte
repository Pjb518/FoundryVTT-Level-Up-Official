<script>
  import { getContext } from "svelte";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

  import FormSection from "../FormSection.svelte";
  import RadioGroup from "../RadioGroup.svelte";
  import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

  const item = getContext("item");
  const appId = getContext("appId");
  const hasPrerequisite = ["knack", "feat"];

  let editMode = false;

  console.log(appId);
  console.log(item);

  function toggleEditMode() {
    editMode = !editMode;
  }

  const featureTypes = CONFIG.A5E.featureTypes;
</script>

<section>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <header
    class="
            u-align-center
            u-flex
            u-font-serif
            u-gap-md
            u-mb-lg
            u-ml-xs
            u-pointer
            u-text-lg
            u-w-fit
        "
    on:click={toggleEditMode}
  >
    <h3>{localize("A5E.TabFeatureProperties")}</h3>
    <i
      class="u-text-sm fas"
      class:fa-chevron-up={editMode}
      class:fa-edit={!editMode}
    />
  </header>

  {#if editMode}
    <div class="u-flex u-flex-col u-gap-md">
      <FormSection heading="A5E.FeatureTypePrompt">
        <RadioGroup
          options={Object.entries(featureTypes)}
          selected={$item.system.featureType}
          name="system.featureType"
          document={item}
        />
      </FormSection>
    </div>
  {:else}
    <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
      <div class="u-flex u-gap-md">
        <dt class="u-text-bold">
          {localize("A5E.FeatureTypePrompt")}:
        </dt>
        <dd class="u-m-0 u-p-0">
          {localize(featureTypes[$item.system.featureType] ?? "A5E.None")}
        </dd>
      </div>
    </dl>
  {/if}

  {#if hasPrerequisite.includes($item.system.featureType)}
    {#if editMode}
      <FormSection heading="Prerequisite:">
        <div
          class="u-align-center u-flex u-flex-wrap u-gap-md u-text-sm u-w-full"
        >
          <div class="u-align-center u-flex u-gap-md u-w-full">
            <input
              class="u-pl-lg"
              type="text"
              name="system.prerequisite"
              value={$item.system.prerequisite}
              id={`${appId}-prerequisite`}
              on:change={({ target }) =>
                updateDocumentDataFromField($item, target.name, target.value)}
            />
          </div>
        </div>
      </FormSection>
    {:else if $item.system.prerequisite != ""}
      <dl class="a5e-box u-flex u-flex-col u-gap-sm u-m-0 u-p-md u-text-sm">
        <div class="u-flex u-gap-md">
          <dt class="u-text-bold">Prerequisite:</dt>
          <dd class="align-center u-flex u-gap-sm u-m-0 u-p-0">
            {$item.system.prerequisite}
          </dd>
        </div>
      </dl>
    {/if}
  {/if}
</section>
