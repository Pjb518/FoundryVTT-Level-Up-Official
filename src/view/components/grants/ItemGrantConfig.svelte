<script lang="ts">
  import { setContext } from "svelte";

  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import GrantConfig from "./GrantConfig.svelte";

  import DropArea from "#view/snippets/DropArea.svelte";
  import DropTag from "#view/snippets/DropTag.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";
  import type { ItemGrant } from "#data/item/Grants/ItemGrant.ts";

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
        quantityOverride: doc.system?.quantity ?? 0,
      });
      onUpdateValue(key, updateArray);
    }

    if (key === "config.items.options") {
      if (optionalUuids.includes(value)) return;

      const updateArray = [...(grant.config.items.options ?? [])];
      const doc = fromUuidSync(value) as Item.OfType<"object"> | null;
      updateArray.push({
        uuid: value,
        quantityOverride: doc.system?.quantity ?? 0,
      });
      onUpdateValue(key, updateArray);
    }
  }

  let { document, grantId, grantType }: Props = $props();

  let item: Item.OfType<"feature"> = document;

  let grant = $derived(item.reactive.system.grants[grantId]) as ItemGrant;
  let baseUuids = $derived(grant.config.items.base.map((i) => i.uuid) ?? []);
  let optionalUuids = $derived(
    grant.config.items.options.map((i) => i.uuid) ?? [],
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

  <Section heading="Base Items" --a5e-section-margin="0.25rem 0">
    <DropArea
      type="uuid"
      documentType="Item"
      onDocumentDropped={(value) =>
        onDropUpdate("config.items.base", value.uuid)}
    />

    <DropTag
      embeddedData={grant.config.items.base}
      type="item"
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
      type="item"
      onUpdateSelection={(value) =>
        onUpdateValue("config.items.options", value)}
    />
  </Section>

  <GrantConfig>
    <FieldWrapper heading="Total Count">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={grant.config.items.total ?? 0}
        onchange={({ currentTarget }) =>
          onUpdateValue("config.items.total", Number(currentTarget.value))}
      />
    </FieldWrapper>
  </GrantConfig>
</form>
