<script lang="ts">
  import { getACComponents } from "#utils/getACComponents.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";

  type Props = {
    document: any;
  };

  let { document }: Props = $props();

  let actor = document;
  let actorStore = $derived(actor.reactive.system);

  let acFormula = $derived(getACComponents(actor.reactive));
</script>

<Section --a5e-section-body-gap="0.75rem" --a5e-section-padding="0.75rem">
  <FieldWrapper
    heading="A5E.armorClass.baseFormula"
    hint="For NPCs this value states their Natural Armor."
  >
    <input
      class="a5e-input a5e-input--slim"
      type="text"
      name="system.attributes.ac.baseFormula"
      value={actorStore.attributes.ac.baseFormula}
      onchange={({ currentTarget }) =>
        updateDocumentDataFromField(actor, currentTarget.name, currentTarget.value)}
    />
  </FieldWrapper>

  {#if actor.type === "vehicle" && actorStore.details.terrain === "space"}
    <FieldWrapper heading="A5E.vehicle.driver">
      <label class="a5e-vehicle-ac-driver-dex">
        <input
          type="checkbox"
          name="system.attributes.ac.addDriverDex"
          checked={actorStore.attributes.ac.addDriverDex}
          onchange={({ currentTarget }) =>
            updateDocumentDataFromField(actor, currentTarget.name, currentTarget.checked)}
        />

        {_loc("A5E.vehicle.addDriverDex")}
      </label>
    </FieldWrapper>
  {/if}

  <FieldWrapper heading="A5E.armorClass.formula">
    <div class="ac-formula-preview">
      {acFormula}
    </div>
  </FieldWrapper>
</Section>

<style lang="scss">
  .a5e-vehicle-ac-driver-dex {
    display: flex;
    align-items: center;
    gap: var(--a5e-spacing-sm);
    font-size: var(--a5e-text-sm);
  }

  .ac-formula-preview {
    padding: var(--a5e-spacing-sm);
    font-size: var(--a5e-text-sm);
    border: var(--a5e-border-width-thin) solid var(--a5e-color-border-subtle);
    border-radius: 4px;
  }
</style>
