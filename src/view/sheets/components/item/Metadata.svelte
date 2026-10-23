<script lang="ts">
  import { getContext } from "svelte";
  import { localize } from "#utils/localization/localize.ts";

  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import Checkbox from "#view/snippets/Checkbox.svelte";
  import EditablePillGroup from "#view/snippets/EditablePillGroup.svelte";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Pill from "#view/snippets/Pill.svelte";
  import Section from "#view/snippets/Section.svelte";

  let item: any = getContext("item");
  let itemStore = $derived(item.reactive.system);

  let editMode = $state(true);
</script>

<Section
  heading="Metadata"
  headerButtons={[
    {
      classes: `icon fa-solid ${editMode ? "fa-chevron-up" : "fa-edit"}`,
      handler: () => (editMode = !editMode),
    },
  ]}
  --a5e-section-body-gap="0.75rem"
  --a5e-section-heading-gap="0.5rem"
  --a5e-section-heading-template-columns="max-content max-content"
>
  {#if editMode}
    <!-- Slug -->
    <FieldWrapper heading="A5E.metadata.slug.setting">
      <input
        type="text"
        class="a5e-input a5e-input--slim"
        value={itemStore.slug || ""}
        placeholder={item.reactive.slug}
        onchange={({ currentTarget }) => {
          const slug = currentTarget.value.slugify({ strict: true });
          updateDocumentDataFromField(item, "system.slug", slug);
        }}
      />
    </FieldWrapper>

    <!-- Tags -->
    <FieldWrapper heading="A5E.metadata.tags.setting">
      <!-- Automatic Tags -->
      <div class="a5e-item-properties__tags">
        {#each item.reactive.tags as tag}
          <Pill label={tag} />
        {/each}
      </div>

      <!-- Custom Tags -->
      <div class="a5e-item-properties__custom-tags">
        <EditablePillGroup
          heading="Custom Tags"
          values={itemStore.tags}
          onUpdateSelection={(values) => {
            console.log(values);
            updateDocumentDataFromField(item, "system.tags", values);
          }}
          preProcessValue={(value) => {
            return value.trim().slugify({ strict: true });
          }}
          --a5e-pill-icon-size="var(--a5e-text-xs)"
        />
      </div>
    </FieldWrapper>

    <!-- Source -->

    <Checkbox
      label="A5E.metadata.favorite.setting"
      checked={itemStore.favorite}
      onUpdateSelection={(detail) => {
        updateDocumentDataFromField(item, "system.favorite", detail);
      }}
    />

    {#if item.type === "feature"}
      <Checkbox
        label="A5E.metadata.hidden.setting"
        checked={itemStore.hidden}
        onUpdateSelection={(detail) => {
          updateDocumentDataFromField(item, "system.hidden", detail);
        }}
      />
    {/if}
  {:else}
    <dl class="a5e-dl-box">
      <div class="a5e-dl-box__section">
        <dt class="a5e-dl-box__header">
          {localize("A5E.metadata.favorite.title")}:
        </dt>

        <dd class="a5e-dl-box__content">
          {itemStore.favorite ? "Yes" : "No"}
        </dd>
      </div>
      {#if item.type === "feature"}
        <div class="a5e-dl-box__section">
          <dt class="a5e-dl-box__header">
            {localize("A5E.metadata.hidden.title")}:
          </dt>

          <dd class="a5e-dl-box__content">
            {itemStore.hidden ? "Yes" : "No"}
          </dd>
        </div>
      {/if}
    </dl>
  {/if}
</Section>

<style lang="scss">
  .a5e-item-properties {
    &__tags {
      display: flex;
      gap: var(--a5e-spacing-sm);
      flex-wrap: wrap;
      font-size: var(--a5e-text-sm);

      padding: var(--a5e-spacing-none);
      margin: var(--a5e-spacing-none);
      list-style: none;
    }

    &__custom-tags {
      margin-top: var(--a5e-spacing-sm);
      font-size: var(--a5e-text-sm);
    }
  }
</style>
