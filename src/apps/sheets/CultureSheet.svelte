<svelte:options accessors={true} />

<script>
  import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
  import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
  import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
  import { getContext, setContext } from "svelte";
  import { object_without_properties } from "svelte/internal";

  import BackgroundSheetHeader from "../components/backgroundSheetHeader/BackgroundSheetHeader.svelte";
  import DropArea from "../components/DropArea.svelte";
  import LinkedDocumentsHelper from "../utils/LinkedDocumentsHelper";

  import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

  export let { itemDocument } = getContext("external").application;
  export let elementRoot;

  const config = CONFIG.A5E;

  const item = new TJSDocument(itemDocument);
  const linkedFeatures = new LinkedDocumentsHelper(itemDocument, "features", {
    validate: (obj) =>
      obj.type === "feature" && obj.system.featureType === "culture",
  });

  setContext("item", item);

  function handleAddFeature(event) {
    const [dragEvent, _] = event.detail;

    try {
      const { uuid } = JSON.parse(dragEvent.dataTransfer.getData("text/plain"));
      linkedFeatures.add({ uuid, optional: false });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReplaceFeature(event) {
    const [dragEvent, feature] = event.detail;

    try {
      const oldUuid = feature.get().uuid;
      const { uuid } = JSON.parse(dragEvent.dataTransfer.getData("text/plain"));

      if (linkedFeatures.replace(oldUuid, { uuid, optional: false })) {
        feature.setFromUUID(uuid);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleDeleteFeature(event) {
    const [_, feature] = event.detail;

    try {
      const { uuid } = feature.get();
      linkedFeatures.remove(uuid);
      feature.setFromUUID(null);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<ApplicationShell bind:elementRoot>
  <main>
    <BackgroundSheetHeader />

    <section class="main-config-wrapper">
      <div class="drop-area-wrapper">
        <h3>Features</h3>

        <ul class="drop-area-list">
          {#each Object.values($item.system.features) as feature (feature.uuid)}
            <li>
              <DropArea
                uuid={feature.uuid}
                on:item-dropped={handleReplaceFeature}
                on:item-deleted={handleDeleteFeature}
              />
            </li>
          {/each}

          <li>
            <DropArea uuid={null} on:item-dropped={handleAddFeature} />
          </li>
        </ul>
      </div>
    </section>
  </main>
</ApplicationShell>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .drop-area-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: "Modesto Condensed", serif;
    font-size: 1rem;
  }

  .drop-area-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .main-config-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.75rem;
    overflow-y: auto;
  }
</style>
