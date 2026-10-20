<script lang="ts">
  import { setContext } from "svelte";

  import type { SkillSpecialtyGrant } from "#data/item/Grants/SkillSpecialtyGrant.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
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
    if (key === "config.skill") {
      updateDocumentDataFromField(
        item,
        `system.grants.${grantId}.config.specialties`,
        {
          base: [],
          options: [],
          total: 0,
        },
      );
    }

    key = `system.grants.${grantId}.${key}`;
    updateDocumentDataFromField(item, key, value);
  }

  let { document, grantId, grantType }: Props = $props();

  let item: Item.OfType<"feature"> = document;
  const { skills, skillSpecialties } = CONFIG.A5E;

  let grant = $derived(
    item.reactive.system.grants[grantId],
  ) as SkillSpecialtyGrant;
  let skill = $derived(grant?.config.skill || "acr");
  let specialties = $derived(skillSpecialties[skill]);
  let selectionType = $derived(grant?.config.selectionType || "limited");
  const selectionTypeOpts = Object.entries(
    (grant?.schema?.getField("config.selectionType") as any)?.choices ?? {
      limited: "Limited",
      pool: "Pool",
    },
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
    heading="Selection Type"
    --a5e-section-margin="0.25rem 0"
    --a5e-section-body-direction="row"
  >
    <RadioGroup
      options={selectionTypeOpts}
      selected={selectionType}
      allowDeselect={false}
      onUpdateSelection={(value) => {
        onUpdateValue("config.selectionType", value);
      }}
    />
  </Section>

  {#if selectionType === "pool"}
    <FieldWrapper heading="Only Proficient Skills">
      <input
        type="checkbox"
        checked={grant?.config.pool?.proficientOnly ?? true}
        onchange={({ currentTarget }) =>
          onUpdateValue("config.pool.proficientOnly", currentTarget.checked)}
      />
    </FieldWrapper>

    <FieldWrapper heading="Selectable Options Count">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        min="1"
        value={grant?.config.pool?.count ?? 1}
        onchange={({ currentTarget }) =>
          onUpdateValue(
            "config.pool.count",
            Math.max(1, Number(currentTarget.value)),
          )}
      />
    </FieldWrapper>
  {:else}
  <Section
    heading="Skill Specialty Selection"
    --a5e-section-margin="0.25rem 0"
    --a5e-section-body-direction="row"
  >
    <RadioGroup
      options={Object.entries(skills)}
      selected={skill}
      onUpdateSelection={(value) => {
        onUpdateValue("config.skill", value);
      }}
    />
  </Section>

  <!-- Keep this else it breaks when switching from tools to weapons -->
  {#key skill}
    <CustomTagGroup
      heading="Base Options"
      options={Object.entries(specialties)}
      selected={grant?.config.specialties?.base}
      disabledOptions={grant?.config.specialties?.options}
      showToggleAllButton={true}
      onUpdateSelection={(value) => {
        onUpdateValue("config.specialties.base", value);
      }}
    />

    <CustomTagGroup
      heading="Optional Choices"
      options={Object.entries(specialties)}
      selected={grant?.config.specialties?.options}
      disabledOptions={grant?.config.specialties?.base}
      showToggleAllButton={true}
      onUpdateSelection={(value) => {
        onUpdateValue("config.specialties.options", value);
      }}
    />

    <FieldWrapper heading="Selectable Options Count">
      <input
        class="a5e-input a5e-input--slim a5e-input--small"
        type="number"
        value={grant?.config.specialties?.total ?? 1}
        onchange={({ currentTarget }) =>
          onUpdateValue(
            "config.specialties.total",
            Number(currentTarget.value),
          )}
      />
    </FieldWrapper>
  {/key}
  {/if}

  <GrantConfig />
</form>
