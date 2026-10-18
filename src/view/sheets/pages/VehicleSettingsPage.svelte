<script lang="ts">
  import { getContext } from "svelte";

  import { getVehicleCapacity } from "#utils/getVehicleCapacity.ts";
  import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

  import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
  import Section from "#view/snippets/Section.svelte";

  const fields = [
    { key: "supply", label: "A5E.vehicle.settings.supply" },
    { key: "bulky", label: "A5E.vehicle.settings.bulky" },
    { key: "carry", label: "A5E.vehicle.settings.carry" },
  ] as const;

  let actor: any = getContext("actor");

  let system = $derived(actor.reactive.system);
  let capacity = $derived(getVehicleCapacity(actor.reactive));

  function update(key: string, value: string) {
    updateDocumentDataFromField(
      actor,
      `system.capacity.${key}`,
      value === "" ? null : Math.max(Number(value), 0),
    );
  }
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--scrollable">
  <Section --a5e-section-body-gap="0.75rem" --a5e-section-body-padding="0.75rem">
    {#each fields as { key, label }}
      <FieldWrapper heading={label}>
        <input
          class="a5e-input a5e-input--slim a5e-input--small"
          class:disable-pointer-events={!actor.isOwner}
          type="number"
          min="0"
          name="system.capacity.{key}"
          value={system.capacity[key]}
          placeholder={String(capacity.defaults[key])}
          onchange={({ currentTarget }) => update(key, currentTarget.value)}
        />
      </FieldWrapper>
    {/each}

    <small>{game.i18n.localize("A5E.vehicle.settings.hint")}</small>
  </Section>
</section>

<style lang="scss">
  .disable-pointer-events {
    pointer-events: none;
  }
</style>
