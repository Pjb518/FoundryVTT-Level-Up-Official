<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { document, appId } = getContext("#external").application;

    const actor = new TJSDocument(document);
    const creatureSizes = Object.entries(CONFIG.A5E.actorSizes);
</script>

<article>
    <FormSection heading="A5E.SizeCategory">
        <RadioGroup
            options={creatureSizes}
            selected={$actor.system.traits.size}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    "system.traits.size",
                    event.detail,
                )}
        />
    </FormSection>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 0.5rem;
        overflow: auto;
        background: $color-sheet-background;
    }
</style>
