<script lang="ts">
  import { setContext } from "svelte";
  import { localize } from "#utils/localization/localize.ts";
  import prepareProficiencyConfigObject from "#utils/prepareProficiencyConfigObject.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import Checkbox from "#view/snippets/Checkbox.svelte";
  import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
  import ComplexDetailEmbed from "#view/snippets/ComplexDetailEmbed.svelte";
  import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Section from "#view/snippets/Section.svelte";
  import Tag from "#view/snippets/Tag.svelte";
  import GrantConfig from "./GrantConfig.svelte";

  type Props = {
    document: Item.ofType<"feature">;
    grantId: string;
    grantType: string;
  };

  function addOptsGroup() {
    updateDocumentDataFromField(
      item,
      `system.grants.${grantId}.config.keys.options`,
      [...grant.config.keys.options, { count: 0, candidates: [] }],
    );
  }

  function deleteOptsGroup(idx: number) {
    const updated = grant.config.keys.options.filter((_, i) => i !== idx);

    updateDocumentDataFromField(
      item,
      `system.grants.${grantId}.config.keys.options`,
      updated,
    );
  }

  function getDisabled() {
    if (selectedMode === "base") return [];
    return [...convertValues(grant.config.keys.base)];
  }

  function getModes() {
    const modes = ["Base"];
    if (grant.config.keys.options.length) {
      grant.config.keys.options.forEach((_, idx) => {
        modes.push(`Option ${idx + 1}`);
      });
    }

    return modes.map((m) => [m.slugify(), m]);
  }

  function convertValues(values: string[]) {
    return values.reduce((acc, val) => {
      if (!val.includes(":")) return acc;
      const parts = val.split(":");
      if (parts.length < 2) return acc;

      // Filter out prof type
      if (proficiencyType !== parts[0]) return acc;
      acc.push(parts[1]);

      return acc;
    }, [] as string[]);
  }

  function getSelectedOpts() {
    if (selectedMode === "base") {
      return [...convertValues(grant.config.keys.base)];
    }

    const idx = Number.parseInt(selectedMode.split("-")[1], 10) - 1;
    return [
      ...convertValues(grant.config.keys.options[idx ?? 0].candidates ?? []),
    ];
  }

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

  function onUpdateOptCount(idx: number, value: number) {
    const opts = foundry.utils.deepClone(grant.config.keys.options);
    opts[idx].count = value;
    onUpdateValue("config.keys.options", opts);
  }

  function onUpdateSelections(values: string[], toggled?: boolean | string) {
    // Convert base values
    const converted = values.map((val) => {
      return `${proficiencyType}:${val}`;
    });

    if (selectedMode === "base") {
      const toKeep = grant.config.keys.base.filter(
        (val) => !val.startsWith(proficiencyType),
      );
      onUpdateValue(`config.keys.base`, [...toKeep, ...converted]);
      return;
    }

    const opts = foundry.utils.deepClone(grant.config.keys.options);
    const idx = Number.parseInt(selectedMode.split("-")[1], 10) - 1;
    const toKeep = opts[idx].candidates.filter(
      (val) => !val.startsWith(proficiencyType),
    );
    opts[idx].candidates = [...toKeep, ...converted];
    onUpdateValue("config.keys.options", opts);
  }

  function onUpdateValue(key: string, value: any) {
    key = `system.grants.${grantId}.${key}`;
    updateDocumentDataFromField(item, key, value);
  }

  let { document, grantId, grantType }: Props = $props();

  const item = document;
  const configObject = prepareProficiencyConfigObject();
  const { weaponCategories, toolCategories } = CONFIG.A5E;

  let grant = $derived(item.reactive.system.grants[grantId]);
  $inspect(grant);

  // View vars
  let addModes = $derived(getModes());
  let selectedMode = $state("base");
  let proficiencyType = $state("armor");
  let options = $derived(configObject[proficiencyType]?.config ?? []);
  let selectedOpts = $derived(getSelectedOpts());
  let disabled = $derived(getDisabled());

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
          onUpdateValue("label", currentTarget.value)}
      />
    </div>
  </header>

  <div class="a5e-grant--proficiency">
    <aside class="a5e-grant--proficiency__opts">
      <!-- Type of proficiency -->
      <Section
        heading="Proficiency Type"
        --a5e-section-margin="0.25rem 0"
        --a5e-section-body-gap="0.75rem"
      >
        <RadioGroup
          options={Object.entries(configObject ?? {}).map(
            ([key, { label }]) => [key, _loc(label)],
          )}
          selected={proficiencyType}
          allowDeselect={false}
          onUpdateSelection={(value) => (proficiencyType = value)}
        />
      </Section>

      <hr />

      <!-- Render Options -->
      <!-- Needed for complex logic re-render -->
      {#key proficiencyType}
        {#if ["tool", "weapon"].includes(proficiencyType)}
          <ComplexDetailEmbed
            heading="Selections"
            configObject={options}
            existingProperties={selectedOpts}
            disabledProperties={disabled}
            headings={proficiencyType === "tool"
              ? toolCategories
              : weaponCategories}
            onUpdateSelection={(value) => {
              onUpdateSelections(value);
            }}
          />
        {:else if ["skill", "savingThrow"].includes(proficiencyType)}
          <CheckboxGroup
            heading="Selections"
            {options}
            selected={selectedOpts}
            disabledOptions={disabled}
            showToggleAllButton={true}
            onUpdateSelection={(value) => {
              onUpdateSelections(value);
            }}
          />
        {:else}
          <CustomTagGroup
            heading="Selections"
            {options}
            selected={selectedOpts}
            showToggleAllButton={true}
            disabledOptions={disabled}
            onUpdateSelection={(value) => {
              onUpdateSelections(value);
            }}
          />
        {/if}
      {/key}
    </aside>

    <!-- Render Config -->
    <div class="a5e-grant--proficiency__config">
      <!-- View Config Selections -->
      <Section
        heading="Configuring Selections For: "
        headerButtons={[
          {
            htmlString: '<i class="fa-solid fa-plus"></i>',
            tooltip: "Add Options Group",
            handler: () => addOptsGroup(),
          },
        ]}
      >
        <RadioGroup
          options={addModes}
          selected={selectedMode}
          onUpdateSelection={(value) => (selectedMode = value)}
        />
      </Section>

      <hr />

      <!-- Base Options -->
      <Section heading="Base Choices">
        <div class="a5e-grant--proficiency__selected">
          {#if grant.config.keys.base.size}
            {#each grant.config.keys.base as value}
              <Tag
                label={value}
                {value}
                tight={true}
                displayOnly={true}
                optionStyles="
                max-width: 98%;
                border: 1px solid var(--a5e-border-color);
                "
                --a5e-tag-background-color="var(--a5e-actor-sidebar-pill-color)"
                --a5e-tag-border-color="var(--a5e-actor-sidebar-pill-border)"
              />
            {/each}
          {:else}
            No Selections Selected
          {/if}
        </div>
      </Section>

      <!-- Optional Groups -->
      {#each grant.config.keys.options as opt, idx (idx)}
        <Section
          heading="Option {idx + 1} Choices"
          headerButtons={[
            {
              htmlString:
                '<i style="font-size: var(--a5e-xs-text)" class="fa-solid fa-trash"></i>',
              tooltip: "Delete Options Group",
              handler: () => deleteOptsGroup(idx),
            },
          ]}
        >
          <div class="a5e-grant--proficiency__selected">
            {#if opt.candidates.size}
              {#each opt.candidates as value}
                <Tag
                  label={value}
                  {value}
                  tight={true}
                  displayOnly={true}
                  optionStyles="
                      max-width: 98%;
                      border: 1px solid var(--a5e-border-color);
                      "
                  --a5e-tag-background-color="var(--a5e-actor-sidebar-pill-color)"
                  --a5e-tag-border-color="var(--a5e-actor-sidebar-pill-border)"
                />
              {/each}
            {:else}
              No Selections Selected
            {/if}
          </div>

          <div class="a5e-grant--proficiency__count">
            <input
              id="a5e-prof-grant-count-{idx}"
              class="a5e-input a5e-input--slim a5e-input--small"
              type="number"
              value={opt.count ?? 1}
              onchange={({ currentTarget }) => {
                onUpdateOptCount(idx, Number.parseInt(currentTarget.value, 10));
              }}
            />

            <label for="a5e-prof-grant-count-{idx}">
              Selectable Options Count
            </label>
          </div>
        </Section>
      {/each}

      <hr />

      {#if proficiencyType === "skill"}
        <Checkbox
          label="Upgrade to expertise dice if already proficient"
          checked={grant.config.upgradeToExpertise ?? true}
          onUpdateSelection={(value) =>
            onUpdateValue("config.upgradeToExpertise", value)}
        />

        <Checkbox
          label="Grant 5e expertise in these instead of proficiency"
          checked={grant.config.isExpertise ?? false}
          onUpdateSelection={(value) =>
            onUpdateValue("config.isExpertise", value)}
        />
      {/if}

      <GrantConfig />
    </div>
  </div>
</form>
