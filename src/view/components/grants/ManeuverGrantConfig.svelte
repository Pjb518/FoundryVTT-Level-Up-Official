<script lang="ts">
  import { setContext } from "svelte";

  import type { ManeuverGrant } from "#data/item/Grants/ManeuverGrant.ts";
  import { localize } from "#utils/localization/localize.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import CodeEditor from "#view/components/CodeEditor.svelte";
  import DropArea from "#view/snippets/DropArea.svelte";
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

  async function openDocument(uuid: string) {
    const doc = (await fromUuid(uuid)) as Item.OfType<"maneuver"> | null;
    doc?.sheet?.render(true);
  }

  function onUpdateValue(key: string, value: any) {
    key = `system.grants.${grantId}.${key}`;
    updateDocumentDataFromField(item, key, value);
  }

  function updateManeuver(
    type: "base" | "options",
    idx: number,
    key: string,
    value: any,
  ) {
    const maneuvers = type === "base" ? baseManeuvers : optionalManeuvers;
    const maneuver = maneuvers[idx];
    maneuver[key] = value;

    onUpdateValue(
      `config.maneuvers.${type}`,
      maneuvers.map(({ uuid, exertionCost }) => ({ uuid, exertionCost })),
    );
  }

  function removeManeuver(type: "base" | "options", idx: number) {
    const maneuvers = type === "base" ? baseManeuvers : optionalManeuvers;

    onUpdateValue(
      `config.maneuvers.${type}`,
      maneuvers
        .filter((_, i) => i !== idx)
        .map(({ uuid, exertionCost }) => ({ uuid, exertionCost })),
    );
  }

  function onDropUpdate(type: "base" | "options", uuid: string) {
    const maneuver = fromUuidSync(uuid) as Item.OfType<"maneuver"> | null;
    if (!maneuver) return;

    if (maneuver.type !== "maneuver") {
      return ui.notifications.error("Invalid Document - Must be a Maneuver.");
    }

    const maneuvers = type === "base" ? baseManeuvers : optionalManeuvers;
    if (maneuvers.some((m) => m.uuid === uuid)) return;

    onUpdateValue(`config.maneuvers.${type}`, [
      ...maneuvers.map(({ uuid, exertionCost }) => ({ uuid, exertionCost })),
      { uuid, exertionCost: maneuver.system.exertionCost ?? 0 },
    ]);
  }

  function getManeuverData(data: any[]) {
    return data.map((e) => {
      const maneuver = fromUuidSync(e.uuid) as Item.OfType<"maneuver"> | null;
      return {
        uuid: e.uuid,
        name: maneuver?.name || "Unknown Maneuver",
        img: maneuver?.img || "",
        exertionCost: e.exertionCost ?? 0,
      };
    });
  }

  let { document, grantId, grantType }: Props = $props();

  let item: Item.OfType<"feature"> = document;
  const { A5E } = CONFIG;

  let grant = $derived(item.reactive.system.grants[grantId]) as ManeuverGrant;
  let baseManeuvers = $derived(
    getManeuverData(grant.config.maneuvers.base ?? []),
  );
  let optionalManeuvers = $derived(
    getManeuverData(grant.config.maneuvers.options ?? []),
  );
  let consumerType = $derived(grant.config.consumerData.type ?? "exertion");

  let consumerOptions = $derived(
    grant.schema.getField("config.consumerData.type")?.choices ?? {},
  );

  const sections = [
    { type: "base", heading: "A5E.grants.maneuver.baseManeuvers" },
    { type: "options", heading: "A5E.grants.maneuver.optionalManeuvers" },
  ] as const;

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

  {#each sections as { type, heading } (type)}
    {@const maneuvers = type === "base" ? baseManeuvers : optionalManeuvers}

    <Section {heading} --a5e-section-margin="0.25rem 0">
      <DropArea
        type="uuid"
        documentType="Item"
        onDocumentDropped={(data) => onDropUpdate(type, data.uuid)}
      />

      {#if maneuvers.length > 0}
        <div class="maneuver-table">
          <header class="maneuver-table__header">
            <span class="maneuver-table__heading"></span>
            <span class="maneuver-table__heading"></span>
            <span class="maneuver-table__heading">
              {localize("A5E.consumers.exertionCost")}
            </span>
            <span class="maneuver-table__heading"></span>
          </header>

          <hr class="maneuver-table__rule" />

          {#each maneuvers as maneuver, idx (maneuver.uuid)}
            <img
              class="maneuver-table__img"
              src={maneuver.img}
              alt={maneuver.name}
            />

            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <span
              class="maneuver-table__name"
              onclick={() => openDocument(maneuver.uuid)}
            >
              {maneuver.name}
            </span>

            <span class="maneuver-table__exertion-cost">
              <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={maneuver.exertionCost}
                onchange={({ currentTarget }) =>
                  updateManeuver(
                    type,
                    idx,
                    "exertionCost",
                    Number(currentTarget.value),
                  )}
              />
            </span>

            <button
              type="button"
              class="maneuver-table__delete-button"
              aria-label="Delete Maneuver"
              onclick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeManeuver(type, idx);
              }}
            >
              <i class="icon fa-solid fa-trash"></i>
            </button>
          {/each}
        </div>
      {/if}
    </Section>
  {/each}

  <Section
    heading="A5E.grants.maneuver.maneuverConfig"
    --a5e-section-body-gap="0.75rem"
  >
    <!-- Consumer Type -->
    <FieldWrapper heading="A5E.grants.maneuver.consumerType">
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
    {#if consumerType !== "exertion"}
      <FieldWrapper heading="A5E.grants.maneuver.usesFormula">
        <input
          class="a5e-input a5e-input--slim"
          type="text"
          value={grant.config.consumerData.value ?? ""}
          onchange={({ currentTarget }) =>
            onUpdateValue("config.consumerData.value", currentTarget.value)}
        />
      </FieldWrapper>

      <FieldWrapper heading="A5E.grants.maneuver.every">
        <RadioGroup
          options={Object.entries(A5E.resourceRecoveryOptions)}
          selected={grant.config.consumerData.recover || "longRest"}
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
    <FieldWrapper heading="A5E.grants.maneuver.totalCount">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={grant.config.maneuvers.total ?? 0}
        onchange={({ currentTarget }) =>
          onUpdateValue("config.maneuvers.total", Number(currentTarget.value))}
      />
    </FieldWrapper>
  </GrantConfig>
</form>

<style lang="scss">
  .maneuver-table {
    display: grid;
    grid-template-columns: 2rem 1fr max-content 2rem;
    align-items: center;
    column-gap: 0.75rem;
    row-gap: 0.25rem;
    margin-top: 0.5rem;
    padding: 0.25rem;

    &__header {
      display: contents;
      font-size: var(--a5e-sm-text);
      text-align: center;
    }

    &__heading {
      font-size: inherit;
      font-weight: bold;
    }

    &__rule {
      width: 100%;
      grid-column: span 4;
      margin-block: 0.25rem;
      border: 0.5px solid var(--a5e-border-color);
    }

    &__img {
      width: 1.7rem;
      height: 1.7rem;
      border-radius: 4px;
    }

    &__name {
      font-size: var(--a5e-sm-text);
      text-align: left;
      width: 100%;
      text-overflow: ellipsis;
    }

    &__exertion-cost {
      display: flex;
      justify-content: center;
      align-content: center;
      text-align: center;
    }

    &__delete-button {
      all: unset;
      display: flex;
      justify-content: center;

      cursor: pointer;
      font-size: var(--a5e-sm-text);
      grid-column: 4;
    }
  }
</style>
