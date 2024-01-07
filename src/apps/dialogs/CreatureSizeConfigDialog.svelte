<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const creatureSizes = Object.entries(CONFIG.A5E.actorSizes);
</script>

<Section --a5e-section-body-padding="0.75rem">
    <RadioGroup
        heading="A5E.SizeCategory"
        options={creatureSizes}
        selected={$actor.system.traits.size}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.traits.size",
                event.detail,
            )}
    />
</Section>
