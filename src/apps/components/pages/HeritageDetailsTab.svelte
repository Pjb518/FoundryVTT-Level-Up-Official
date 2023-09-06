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
    <FormSection --direction="column" --gap="0.75rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">Size Category</h3>

            <RadioGroup
                options={creatureSizes}
                selected={$item.system.creatureSize.fixed}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.creatureSize.fixed",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">Optional Size Choices</h3>

            <CheckboxGroup
                options={creatureSizes}
                selected={$item.system.creatureSize.options}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.creatureSize.options",
                        detail
                    )}
            />
        </section>
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
