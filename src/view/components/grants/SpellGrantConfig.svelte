<script lang="ts">
  import { setContext } from "svelte";
  import type { SpellGrant } from "#data/item/Grants/SpellGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import CodeEditor from "#view/components/CodeEditor.svelte";
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

  let { document, grantId, grantType }: Props = $props();
  let item: Item.OfType<"feature"> = document;
  const { A5E } = CONFIG;

  let grant = $derived(item.reactive.system.grants[grantId]) as SpellGrant;
  let baseUuids = $derived(grant.config.spells.base ?? []);
  let optionalUuids = $derived(grant.config.spells.options ?? []);
  let consumerType = $derived(grant.config.consumerData.type ?? []);

  let consumerOptions = $derived(
    grant.schema.getField("config.consumerData.type")?.choices ?? {},
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
      onUpdateSelection={(value) => onUpdateValue("config.spells.base", value)}
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
    <FieldWrapper heading="Total Count">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={grant.config.spells.total ?? 0}
        onchange={({ currentTarget }) =>
          onUpdateValue("config.spells.total", Number(currentTarget.value))}
      />
    </FieldWrapper>
  </GrantConfig>
</form>

<style lang="scss"></style>
