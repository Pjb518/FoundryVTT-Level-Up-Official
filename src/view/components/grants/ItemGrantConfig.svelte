<script lang="ts">
  import { setContext } from "svelte";
  import type { ItemGrant } from "#data/item/Grants/ItemGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { getFiltersText } from "#utils/view/getFiltersText.ts";

  import CodeEditor from "#view/components/CodeEditor.svelte";
  import FiltersDialog from "#view/dialogs/compendium-browser/CompendiumFiltersTab.svelte";
  import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";
  import DropArea from "#view/snippets/DropArea.svelte";
  import DropTag from "#view/snippets/DropTag.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Section from "#view/snippets/Section.svelte";
  import GrantConfig from "./GrantConfig.svelte";

  type Props = {
    document: any;
    grantId: string;
    grantType: string;
  };

  function updateImage() {
    const current = grant?.img;

    const filePicker = new foundry.applications.apps.FilePicker({
      type: "image",
      current,
      callback: (path) => {
        onUpdateValue("img", path);
      },
    });

    return filePicker.browse();
  }

  function onUpdateValue(key: string, value: any) {
    key = `system.grants.${grantId}.${key}`;
    updateDocumentDataFromField(item, key, value);
  }

  function onDropUpdate(key: string, value: any) {
    if (key === "config.items.base") {
      if (baseUuids.includes(value)) return;

      const updateArray = [...(grant.config.items.base ?? [])];
      const doc = fromUuidSync(value) as Item.OfType<"object"> | null;
      updateArray.push({
        uuid: value,
        quantityOverride: doc?.system?.quantity ?? 0,
      });
      onUpdateValue(key, updateArray);
    }

    if (key === "config.items.options") {
      if (optionalUuids.includes(value)) return;

      const updateArray = [...(grant.config.items.options ?? [])];
      const doc = fromUuidSync(value) as Item.OfType<"object"> | null;
      updateArray.push({
        uuid: value,
        quantityOverride: doc?.system?.quantity ?? 0,
      });
      onUpdateValue(key, updateArray);
    }
  }

  async function updateFilters() {
    const filters = foundry.utils.deepClone(grant.config.pool.filters);
    const title = `Object Filters - ${grant.name}`;

    const dialogData = {
      compendiumType: "object",
      filterOptions: { selections: filters },
    };

    const options = {
      width: 500,
      resizable: true,
    };

    const dialog = new GenericConfigDialog(
      document,
      title,
      FiltersDialog,
      dialogData,
      options,
    );

    dialog.render(true);
    const data = await dialog.promise;
    if (!data) return;

    onUpdateValue("config.pool.filters", data.selections);
  }

  let { document, grantId, grantType }: Props = $props();

  let item: Item.OfType<"feature"> = document;

  let grant = $derived(item.reactive.system.grants[grantId]) as ItemGrant;
  let baseUuids = $derived(grant.config.items.base.map((i) => i.uuid) ?? []);
  let optionalUuids = $derived(
    grant.config.items.options.map((i) => i.uuid) ?? [],
  );
  let selectionType = $derived(grant.config.selectionType || "pool");
  let filtersText = $derived(getFiltersText(grant));
  let selectionTypeOpts = $derived(
    // @ts-expect-error
    grant.schema.getField("config.selectionType")?.choices ?? {},
  );

  setContext("item", item);
  setContext("grantId", grantId);
  setContext("grantType", grantType);
</script>

<form class="a5e-grant">
  <header class="a5e-grant__header">
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <img
      class="a5e-grant-image"
      src={grant.img || item.img || "icons/svg/upgrade.svg"}
      alt={grant.name}
      onclick={updateImage}
    />

    <div class="a5e-grant-name-wrapper">
      <input
        type="text"
        name="name"
        value={grant.name ?? ""}
        class="a5e-grant-name"
        placeholder="Bonus Name"
        onchange={({ currentTarget }) =>
          onUpdateValue("name", currentTarget.value)}
      />
    </div>
  </header>

  <Section heading="Selection Type" --a5e-section-margin="0.25rem 0">
    <RadioGroup
      options={Object.entries(selectionTypeOpts)}
      selected={selectionType}
      allowDeselect={false}
      onUpdateSelection={(value) =>
        onUpdateValue("config.selectionType", value)}
    />
  </Section>

  {#if selectionType === "limited"}
    <Section heading="Base Items" --a5e-section-margin="0.25rem 0">
      <DropArea
        type="uuid"
        documentType="Item"
        onDocumentDropped={(value) =>
          onDropUpdate("config.items.base", value.uuid)}
      />

      <DropTag
        embeddedData={grant.config.items.base}
        type="object"
        onUpdateSelection={(value) => onUpdateValue("config.items.base", value)}
      />
    </Section>

    <Section heading="Optional Items" --a5e-section-margin="0.25rem 0">
      <DropArea
        type="uuid"
        documentType="Item"
        onDocumentDropped={(value) =>
          onDropUpdate("config.items.options", value.uuid)}
      />

      <DropTag
        embeddedData={grant.config.items.options}
        type="object"
        onUpdateSelection={(value) =>
          onUpdateValue("config.items.options", value)}
      />
    </Section>
  {:else if selectionType === "pool"}
    <Section
      heading="Pool Filters"
      headerButtons={[
        {
          htmlString: '<i class="fa-solid fa-filter"></i>',
          tooltip: "Select Filters",
          handler: () => updateFilters(),
        },
      ]}
      --a5e-section-margin="0.25rem 0"
    >
      {filtersText}
    </Section>
  {/if}

  <Section heading="Object Config" --a5e-section-body-gap="0.75rem">
    <div class="a5e-grant__code-editor">
      {#key grant.config.changes}
        <CodeEditor
          document={item}
          field="grants.{grantId}.config.changes"
          content={grant.config.changes ?? "{}"}
          config={{ language: "json" }}
          heading="Changes"
        />
      {/key}
    </div>
  </Section>

  <GrantConfig>
    <FieldWrapper heading="Total Count">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={selectionType === "limited"
          ? (grant.config.items.total ?? 0)
          : (grant.config.pool.count ?? 1)}
        onchange={({ currentTarget }) => {
          const key =
            selectionType === "limited"
              ? "config.items.total"
              : "config.pool.count";
          onUpdateValue(key, Number(currentTarget.value));
        }}
      />
    </FieldWrapper>
  </GrantConfig>
</form>
