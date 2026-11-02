<script lang="ts">
  import { setContext } from "svelte";
  import type { ResourceGrant } from "#data/item/Grants/ResourceGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Section from "#view/snippets/Section.svelte";

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

  function addLevel() {
    const maxLevel = Math.max(...grant.config.levelData.map((d) => d.level));
    const newLevel = maxLevel + 1;
    const newData = grant.toObject();

    const levels = [...(newData.config.levelData ?? []), { level: newLevel }].sort(
      (a, b) => a.level - b.level,
    );

    onUpdateValue("config.levelData", levels);
  }

  function deleteLevel(idx: number) {
    const grantData = grant.toObject();
    const levels = grantData.config.levelData.toSpliced(idx, 1);

    if (levels.length === 0) {
      ui.notifications.error("Grant needs at least one level of data.");
      return;
    }

    onUpdateValue("config.levelData", levels);
  }

  function getLevelConfigHeader() {
    const header: string[][] = [["Level", "level"]];

    if (grant.config.type === "dice") {
      header.push(["# Dice", "size"]);
      header.push(["Size", "denom"]);
      if (grant.config.consumeType === "none") header.push(["Max", "max"]);
    }

    if (grant.config.type === "uses") {
      header.push(["Max", "max"]);
    }

    header.push(["Per", "per"]);

    return header;
  }

  function onUpdateLevelData(idx: number, key: string, value: any) {
    const levels = grant.toObject()?.config?.levelData ?? [];
    if (!levels.at(idx)) return;

    const currentLevel = levels.at(idx).level;

    if (key === "level") {
      if (levels.some((l) => l.level === value)) {
        ui.notifications.error("2 entries cannot have the same level.");
        return;
      }

      levels.at(idx)[key] = Math.clamp(value, 1, 20);
    } else {
      levels.forEach((l) => {
        if (l.level < currentLevel) return;
        l[key] = value;
      });
    }

    if (key === "level") {
      onUpdateValue(
        "config.levelData",
        levels.sort((a, b) => a.level - b.level),
      );
    } else onUpdateValue("config.levelData", levels);
  }

  function onUpdateType(type: string) {
    const data = { type, slug: grant.config.slug };

    item.update({
      [`system.grants.${grantId}.config`]: _replace(data),
    });
  }

  function onUpdateValue(key: string, value: any) {
    key = `system.grants.${grantId}.${key}`;
    updateDocumentDataFromField(item, key, value);
  }

  let { document, grantId, grantType }: Props = $props();
  let item: Item.OfType<"feature"> = document;
  const { A5E } = CONFIG;

  let grant = $derived(item.reactive.system.grants[grantId]) as ResourceGrant;

  setContext("item", item);
  setContext("grantId", grantId);
  setContext("grantType", grantType);
</script>

{#snippet LevelField(idx, data)}
  <input
    class="a5e-input a5e-input--slim a5e-input--small level-config--level"
    type="number"
    value={Number.parseInt(data.level, 10) ?? 1}
    onchange={({ currentTarget }) =>
      onUpdateLevelData(idx, "level", Number.parseInt(currentTarget.value, 10))}
  />
{/snippet}

{#snippet PerField(idx, data)}
  <select
    class="a5e-input a5e-input--slim a5e-input--fit level-config--per"
    onchange={({ currentTarget }) => onUpdateLevelData(idx, "per", currentTarget.value)}
  >
    {#each Object.entries(A5E.resourceGrantRecoveryOptions) as [value, label]}
      <option {value} selected={data.per === value}>{_loc(label)}</option>
    {/each}
  </select>
{/snippet}

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
        onchange={({ currentTarget }) => onUpdateValue("name", currentTarget.value)}
      />
    </div>
  </header>

  <!-- Resource Type -->
  <Section heading="Resource Type" --a5e-section-margin="0.25rem 0">
    <RadioGroup
      options={Object.entries(CONFIG.A5E.resourceTypes).filter(([id]) => id !== "item")}
      selected={grant.config.type}
      allowDeselect={false}
      onUpdateSelection={(detail) => onUpdateType(detail)}
    />
  </Section>

  <Section
    heading="Resource Configuration"
    --a5e-section-margin="0.25rem 0"
    --a5e-section-body-gap="0.75rem"
  >
    <!-- Shared -->
    <FieldWrapper heading="Slug">
      <input
        class="a5e-input a5e-input--slim"
        type="text"
        value={grant.config.slug ?? ""}
        placeholder={grant.name.slugify({ strict: true })}
        onchange={({ currentTarget }) => {
          const slug = currentTarget.value.slugify({ strict: true });
          onUpdateValue("config.slug", slug);
        }}
      />
    </FieldWrapper>

    <!-- Dice -->
    {#if grant.config.type === "dice"}
      <FieldWrapper heading="Consume Type">
        <RadioGroup
          options={Object.entries(A5E.diceResourceConsumeType)}
          selected={grant.config.consumeType}
          allowDeselect={false}
          onUpdateSelection={(detail) => onUpdateValue("config.consumeType", detail)}
        />
      </FieldWrapper>

      {#if grant.config.consumeType !== "none"}
        <FieldWrapper heading="Use Type">
          <RadioGroup
            options={Object.entries(A5E.diceResourceUseType)}
            selected={grant.config.useType}
            allowDeselect={false}
            onUpdateSelection={(detail) => onUpdateValue("config.useType", detail)}
          />
        </FieldWrapper>
      {/if}
    {/if}
  </Section>

  <Section
    heading="Level Configuration"
    headerButtons={[
      {
        htmlString: '<i class="fa-solid fa-plus"></i>',
        tooltip: "Add Level",
        handler: () => addLevel(),
      },
    ]}
    --a5e-section-margin="0.25rem 0"
    --a5e-section-body-gap="0.75rem"
  >
    <div class="level-config level-config--{grant.config.type}">
      <header class="level-config__header">
        {#each getLevelConfigHeader() as [label, cls]}
          <h3 class="level-config__heading level-config--{cls}">
            {label}
          </h3>
        {/each}
      </header>

      {#each grant.config.levelData as data, idx (idx)}
        <div class="level-config__row">
          {@render LevelField(idx, data)}

          <!-- Dice -->
          {#if grant.config.type === "dice"}
            <input
              class="a5e-input a5e-input--small a5e-input--slim level-config--size"
              type="number"
              value={data.size ?? 1}
              onchange={({ currentTarget }) =>
                onUpdateLevelData(idx, "size", Number.parseInt(currentTarget.value, 10))}
            />

            <select
              class="a5e-input a5e-input--slim a5e-input--small level-config--denom"
              onchange={({ currentTarget }) =>
                onUpdateLevelData(idx, "denom", currentTarget.value)}
            >
              {#each CONFIG.A5E.DICE_SIDES as side}
                <option value={side} selected={side === data.denom}>
                  {side === 0 ? "" : `d${side}`}
                </option>
              {/each}
            </select>

            {#if grant.config.consumeType === "none"}
              <input
                class="a5e-input a5e-input--slim level-config--max"
                type="text"
                value={data.max ?? ""}
                onchange={({ currentTarget }) =>
                  onUpdateLevelData(idx, "max", currentTarget.value)}
              />
            {/if}
          {/if}

          <!-- Uses -->
          {#if grant.config.type === "uses"}
            <input
              class="a5e-input a5e-input--slim level-config--max"
              type="text"
              value={data.max ?? ""}
              onchange={({ currentTarget }) =>
                onUpdateLevelData(idx, "max", currentTarget.value)}
            />
          {/if}

          {@render PerField(idx, data)}

          <button
            type="button"
            class="a5e-button a5e-button--transparent level-config--delete"
            aria-label="Delete Level"
            data-tooltip="Delete Level"
            data-tooltip-direction="UP"
            onclick={() => deleteLevel(idx)}
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      {/each}
    </div>
  </Section>
</form>

<style lang="scss">
  .level-config {
    display: grid;
    gap: var(--a5e-spacing-md);

    &--counter {
      display: grid;
      grid-template-columns: repeat(3, min-content);
      grid-template-areas: "level per delete";
    }

    &--dice {
      display: grid;
      grid-template-columns: repeat(3, min-content) 1fr repeat(2, min-content);
      grid-template-areas: "level size denom max per delete";
    }

    &--uses {
      display: grid;
      grid-template-columns: min-content 1fr repeat(2, min-content);
      grid-template-areas: "level max per delete";
    }

    &__header {
      display: contents;
      text-align: center;
    }

    &__heading {
      margin: var(--a5e-spacing-none);
      font-size: var(--a5e-text-sm);
    }

    &__header,
    &__row {
      grid-column: 1 / -1;

      display: grid;
      grid-template-columns: subgrid;
    }

    &--level {
      grid-area: level;
    }

    &--size {
      grid-area: size;
    }

    &--denom {
      grid-area: denom;
    }

    &--max {
      grid-area: max;
    }

    &--per {
      grid-area: per;
    }

    &--delete {
      grid-area: delete;
    }
  }
</style>
