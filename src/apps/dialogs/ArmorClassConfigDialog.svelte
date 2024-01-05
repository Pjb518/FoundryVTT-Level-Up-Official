<script>
    import { getContext } from "svelte";

    import FieldWrapper from "../components/FieldWrapper.svelte";
    import Section from "../components/Section.svelte";

    import getACComponents from "../../utils/getACComponents";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId } = getContext("#external").application;

    const actor = document;

    $: acFormula = getACComponents($actor);
</script>

<Section
    --a5e-section-body-gap="0.75rem"
    --a5e-section-margin="0"
    --a5e-section-padding="0.75rem"
>
    <FieldWrapper
        heading="A5E.armorClass.baseFormula"
        hint="For NPCs this value states their Natural Armor."
    >
        <input
            class="a5e-input"
            type="text"
            name="system.attributes.ac.baseFormula"
            value={$actor.system.attributes.ac.baseFormula}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.armorClass.formula">
        <div class="u-w-full ac-formula-preview">
            {acFormula}
        </div>
    </FieldWrapper>
</Section>

<style lang="scss">
    .ac-formula-preview {
        padding: 0.5rem;
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
