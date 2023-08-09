<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");

    const creatureSizes = Object.entries(CONFIG.A5E.actorSizes);
    const creatureTypes = Object.entries(CONFIG.A5E.creatureTypes);
</script>

<article>
    <FormSection heading="A5E.SizeCategory">
        <RadioGroup
            options={creatureSizes}
            selected={$item.system.creatureSize}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.creatureSize",
                    detail
                )}
        />
    </FormSection>

    <FormSection heading="A5E.CreatureTypesLabel">
        <CheckboxGroup
            options={creatureTypes}
            selected={$item.system.creatureTypes}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.creatureTypes",
                    detail
                )}
        />
    </FormSection>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 1rem;
        overflow-y: hidden;
    }
</style>
