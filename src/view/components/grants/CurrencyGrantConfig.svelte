<script lang="ts">
  import { setContext } from "svelte";
  import type { CurrencyGrant } from "#data/item/Grants/CurrencyGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

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
  const { currencyDenominations } = CONFIG.A5E;

  let item: Item.OfType<"feature"> = document;

  let grant = $derived(item.reactive.system.grants[grantId]) as CurrencyGrant;
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
    heading="Exertion Bonus Configuration"
    --a5e-section-body-gap="0.75rem"
  >
    <FieldWrapper heading="Currency Amount">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={grant.config.currency.value ?? 0}
        onchange={({ currentTarget }) =>
          onUpdateValue(
            "config.currency.value",
            Number.parseInt(currentTarget.value, 10),
          )}
      />
    </FieldWrapper>

    <FieldWrapper heading="Currency Denomination">
      <RadioGroup
        options={Object.entries(currencyDenominations)}
        selected={grant.config.currency.denom || "gp"}
        allowDeselect={false}
        onUpdateSelection={(value) =>
          onUpdateValue("config.currency.denom", value)}
      />
    </FieldWrapper>
  </Section>

  <GrantConfig />
</form>

<style lang="scss"></style>
