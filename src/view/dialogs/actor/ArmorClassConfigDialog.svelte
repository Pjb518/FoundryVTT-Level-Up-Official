<script lang="ts">
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import { getACComponents } from "#utils/getACComponents.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

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
                updateDocumentDataFromField(
                    actor,
                    currentTarget.name,
                    currentTarget.value,
                )}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.armorClass.formula">
        <div class="ac-formula-preview">
            {acFormula}
        </div>
    </FieldWrapper>
</Section>

<style lang="scss">
    .ac-formula-preview {
        padding: 0.5rem;
        font-size: var(--a5e-sm-text);
        border: 1px solid var(--a5e-border-color);
        border-radius: 4px;
    }
</style>
