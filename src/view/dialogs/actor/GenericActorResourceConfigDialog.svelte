<script lang="ts">
  import handleDeterministicInput from "#utils/handleDeterministicInput.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import RadioGroup from "#view/snippets/RadioGroup.svelte";
  import Section from "#view/snippets/Section.svelte";

  function deleteResource() {
    actor.update({
      [`system.resources.${source}`]: _del,
    });

    dialog.close();
  }

  async function onDrop(
    event: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    },
  ) {
    event.preventDefault();
    event.stopPropagation();

    const transferData = event.dataTransfer?.getData("text/plain");
    if (!transferData) return;

    const dragData = JSON.parse(transferData);

    const parts = foundry.utils.parseUuid(dragData.uuid);
    if (!parts) return;

    if (parts.type === "Item" && parts.id) {
      updateValue("itemId", parts.id);
    }
  }

  async function updateSlug(slug: string, updateName = false) {
    let name = "";
    if (updateName) name = slug;
    slug = slug.slugify({ strict: true });

    const originalSlug = `${source}`;
    const r = resource.toObject();
    r.slug = slug;
    if (updateName) r.name = name;

    await actor.update({
      [`system.resources.${slug}`]: r,
    });

    source = slug;

    await actor.update({
      [`system.resources.${originalSlug}`]: _del,
    });
  }

  function updateType(type: string) {
    const r = { name: resource.name, slug: resource.slug, type };
    actor.update({
      [`system.resources.${source}`]: _replace(r),
    });
  }

  async function updateValue(key: string, value: any) {
    if (key === "max") handleDeterministicInput(value);

    await updateDocumentDataFromField(actor, `system.resources.${source}.${key}`, value);
  }

  let { document, dialog, source } = $props();

  const actor: Creature = document;
  const recoveryOptions = Object.entries(CONFIG.A5E.resourceRecoveryOptions).filter(
    ([v]) => !["recharge", "countdown"].includes(v),
  );

  let resource = $derived(actor.reactive.system.resources[source]);
</script>

<Section
  --a5e-section-body-padding="0.75rem"
  --a5e-section-body-gap="0.75rem"
  --a5e-section-margin="0 0 0.25rem 0"
>
  <FieldWrapper heading="A5E.Name">
    <input
      class="a5e-input a5e-input--slim"
      type="text"
      value={resource.name}
      onchange={({ currentTarget }) => updateSlug(currentTarget.value, true)}
    />
  </FieldWrapper>

  <FieldWrapper heading="A5E.Slug">
    <input
      class="a5e-input a5e-input--slim"
      type="text"
      value={resource.slug}
      placeholder={resource.name.slugify({ strict: true })}
      onchange={({ currentTarget }) => updateSlug(currentTarget.value)}
    />
  </FieldWrapper>

  <FieldWrapper heading="Resource Type">
    <RadioGroup
      options={Object.entries(CONFIG.A5E.resourceTypes)}
      selected={resource.type}
      allowDeselect={false}
      onUpdateSelection={(detail) => updateType(detail)}
    />
  </FieldWrapper>
</Section>

{#if resource.type !== "counter"}
  <Section
    heading="Resource Configuration"
    --a5e-section-body-gap="0.75rem"
    --a5e-section-padding="0 0.75rem 0.75rem 0.75rem"
  >
    {#if resource.type === "item"}
      {let item = $derived(actor.items.get(resource.itemId))}
      <FieldWrapper heading="Item ID {item ? `- ${item.name}` : ''}">
        <input
          class="a5e-input a5e-input--slim"
          type="text"
          value={resource.itemId}
          onchange={({ currentTarget }) => updateValue("itemId", currentTarget.value)}
          ondrop={onDrop}
        />
      </FieldWrapper>
    {/if}

    {#if resource.type === "dice"}
      <FieldWrapper heading="Consumption Type">
        <RadioGroup
          options={Object.entries(CONFIG.A5E.diceResourceConsumeType)}
          selected={resource.consumeType}
          allowDeselect={false}
          onUpdateSelection={(detail) => updateValue("consumeType", detail)}
        />
      </FieldWrapper>

      <FieldWrapper heading="Use Type">
        <RadioGroup
          options={Object.entries(CONFIG.A5E.diceResourceUseType)}
          selected={resource.useType}
          allowDeselect={false}
          onUpdateSelection={(detail) => updateValue("useType", detail)}
        />
      </FieldWrapper>

      <div class="side-by-side">
        <FieldWrapper heading="# Of Dice">
          <input
            class="a5e-input a5e-input--small a5e-input--slim"
            type="number"
            value={resource.size}
            onchange={({ currentTarget }) =>
              updateValue("size", Number.parseInt(currentTarget.value, 10))}
          />
        </FieldWrapper>

        <FieldWrapper heading="Dice Size">
          <select
            class="a5e-input a5e-input--slim a5e-input--fit"
            onchange={({ currentTarget }) =>
              updateValue("denom", Number.parseInt(currentTarget.value, 10))}
          >
            {#each CONFIG.A5E.DICE_SIDES as side}
              <option selected={side === (resource.denom ?? 0)} value={side}>
                {side === 0 ? "" : `d${side}`}
              </option>
            {/each}
          </select>
        </FieldWrapper>
      </div>

      <FieldWrapper heading="Modifier Options">
        <CheckboxGroup
          options={Object.entries(CONFIG.A5E.dieModifiers)}
          selected={[...((resource.modifiers as Set<string>) ?? [])]}
          onUpdateSelection={(values) => updateValue("modifiers", values)}
        />
      </FieldWrapper>
    {/if}

    {#if (resource.type === "dice" && resource.consumeType === "pool") || resource.type === "uses"}
      <FieldWrapper heading="Current Value">
        <input
          class="a5e-input a5e-input--small a5e-input--slim"
          type="number"
          value={resource.value}
          onchange={({ currentTarget }) => {
            updateValue("value", Number.parseInt(currentTarget.value, 10));
          }}
        />
      </FieldWrapper>

      <FieldWrapper heading="A5E.genericResources.maxFormula">
        <input
          class="a5e-input a5e-input--slim"
          type="text"
          value={resource.max}
          onchange={({ currentTarget }) => {
            updateValue("max", currentTarget.value);
          }}
        />
      </FieldWrapper>
    {/if}
  </Section>
{/if}

<Section
  heading="Recovery Configuration"
  --a5e-section-body-gap="0.75rem"
  --a5e-section-padding="0 0.75rem 0.75rem 0.75rem"
>
  <RadioGroup
    heading="A5E.consumers.recoverResourceAt"
    options={recoveryOptions}
    selected={resource.per}
    onUpdateSelection={(detail) => updateValue("per", detail)}
  />

  <button class="" type="button" onclick={deleteResource}> Delete Resource </button>
</Section>

<style lang="scss">
  .side-by-side {
    display: flex;
    gap: var(--a5e-spacing-md);
  }
</style>
