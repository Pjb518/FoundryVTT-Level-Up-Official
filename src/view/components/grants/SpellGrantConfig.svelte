<script lang="ts">
  import { setContext } from "svelte";
  import type { SpellGrant } from "#data/item/Grants/SpellGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import { getFiltersText } from "#utils/view/getFiltersText.ts";

  import CodeEditor from "#view/components/CodeEditor.svelte";
  import FiltersDialog from "#view/dialogs/compendium-browser/CompendiumFiltersTab.svelte";
  import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";
  import Checkbox from "#view/snippets/Checkbox.svelte";
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
    if (key === "config.spells.base") {
      if (baseUuids.includes(value)) return;
      onUpdateValue(key, [...baseUuids, value]);
      return;
    }

    if (optionalUuids.includes(value)) return;
    onUpdateValue(key, [...optionalUuids, value]);
  }

  async function updateFilters() {
    const filters = foundry.utils.deepClone(grant.config.pool.filters);
    const title = `Spell Filters - ${grant.name}`;

    const dialogData = {
      compendiumType: "spell",
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
  const { A5E } = CONFIG;

  let grant = $derived(item.reactive.system.grants[grantId]) as SpellGrant;
  let baseUuids = $derived(grant.config.spells.base ?? []);
  let optionalUuids = $derived(grant.config.spells.options ?? []);
  let consumerType = $derived(grant.config.consumerData.type ?? []);
  let selectionType = $derived(grant.config.selectionType || "pool");
  let filtersText = $derived(getFiltersText(grant));

  let consumerOptions = $derived(
    // @ts-expect-error
    grant.schema.getField("config.consumerData.type")?.choices ?? {},
  );
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
    <Section heading="Base Spells" --a5e-section-margin="0.25rem 0">
      <DropArea
        type="uuid"
        documentType="Item"
        onDocumentDropped={(value) =>
          onDropUpdate("config.spells.base", value.uuid)}
      />

      <DropTag
        embeddedData={grant.config.spells.base}
        type="item"
        onUpdateSelection={(value) =>
          onUpdateValue("config.spells.base", value)}
      />
    </Section>

    <Section heading="Optional Spells" --a5e-section-margin="0.25rem 0">
      <DropArea
        type="uuid"
        documentType="Item"
        onDocumentDropped={(value) =>
          onDropUpdate("config.spells.options", value.uuid)}
      />

      <DropTag
        embeddedData={grant.config.spells.options}
        type="item"
        onUpdateSelection={(value) =>
          onUpdateValue("config.spells.options", value)}
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

  <Section heading="Spell Config" --a5e-section-body-gap="0.75rem">
    <Checkbox
      label="Spell is always prepared"
      checked={grant.config.alwaysPrepared ?? false}
      onUpdateSelection={(value) =>
        onUpdateValue("config.alwaysPrepared", value)}
    />

    <!-- Consumer Type -->
    <FieldWrapper heading="Consumer Type">
      <RadioGroup
        options={Object.entries(consumerOptions ?? {})}
        selected={consumerType}
        allowDeselect={false}
        onUpdateSelection={(value) => {
          onUpdateValue("config.consumerData.type", value);
        }}
      />
    </FieldWrapper>

    <!-- Consumer Value -->
    {#if consumerType !== "spell"}
      <FieldWrapper heading="Uses formula">
        <input
          class="a5e-input a5e-input--slim"
          type="text"
          value={grant.config.consumerData.value ?? ""}
          onchange={({ currentTarget }) =>
            onUpdateValue("config.consumerData.value", currentTarget.value)}
        />
      </FieldWrapper>

      <FieldWrapper heading="Every">
        <RadioGroup
          options={Object.entries(A5E.resourceRecoveryOptions)}
          selected={grant.config.consumerData.recover || "shortRest"}
          allowDeselect={false}
          onUpdateSelection={(value) =>
            onUpdateValue("config.consumerData.recover", value)}
        />
      </FieldWrapper>
    {/if}

    <!-- Changes  -->
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
    <FieldWrapper heading="Selectable Options Count">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={selectionType === "limited"
          ? (grant.config.spells.total ?? 0)
          : (grant.config.pool.count ?? 1)}
        onchange={({ currentTarget }) => {
          const key =
            selectionType === "limited"
              ? "config.spells.total"
              : "config.pool.count";
          onUpdateValue(key, Number(currentTarget.value));
        }}
      />
    </FieldWrapper>
  </GrantConfig>
</form>
