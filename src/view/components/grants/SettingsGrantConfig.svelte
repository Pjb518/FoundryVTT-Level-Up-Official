<script lang="ts">
  import { setContext } from "svelte";
  import type { SettingsGrant } from "#data/item/Grants/SettingsGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import Checkbox from "#view/snippets/Checkbox.svelte";
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

  let { document, grantId, grantType }: Props = $props();
  const { settingsGrantConfig } = CONFIG.A5E;

  let item: Item.OfType<"feature"> = document;

  let grant = $derived(item.reactive.system.grants[grantId]) as SettingsGrant;
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

    <div class="a5e-name-wrapper">
      <input
        class="a5e-input a5e-grant-name"
        type="text"
        name="name"
        value={grant.name ?? ""}
        placeholder="Bonus Name"
        onchange={({ currentTarget }) =>
          onUpdateValue("name", currentTarget.value)}
      />
    </div>
  </header>

  <Section
    heading="Settings Bonus Configuration"
    --a5e-section-body-gap="0.75rem"
  >
    {#each Object.entries(settingsGrantConfig) as [id, conf]}
      <FieldWrapper heading={conf.type === "boolean" ? "" : conf.label}>
        {#if conf.type === "radio"}
          <RadioGroup
            options={Object.entries(conf.config ?? {})}
            selected={(grant.config.settings[id] || conf.default) as string}
            onUpdateSelection={(value) =>
              onUpdateValue(`config.settings.${id}`, value)}
          />
        {:else if conf.type === "boolean"}
          <Checkbox
            label={conf.label}
            checked={(grant.config.settings[id] || conf.default) as boolean}
            onUpdateSelection={(value) =>
              onUpdateValue(`config.settings.${id}`, value)}
          />
        {:else if conf.type === "number"}
          <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            value={(grant.config.settings[id] || conf.default) as number}
            onchange={({ currentTarget }) =>
              onUpdateValue(
                `config.settings.${id}`,
                Number.parseInt(currentTarget.value, 10),
              )}
          />
        {/if}
      </FieldWrapper>
    {/each}
  </Section>

  <GrantConfig />
</form>

<style lang="scss"></style>
