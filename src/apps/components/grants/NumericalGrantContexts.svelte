<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getContextsMap from "../../../utils/getContextsMap";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import CheckBoxGroup from "../CheckboxGroup.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    const item = getContext("item");
    const grantId = getContext("grantId");
    const grantType = getContext("grantType");
    const getProperty = foundry.utils.getProperty;
    const contextMap = getContextsMap("grant", grantType);

    function onUpdateValue(key, value) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    $: grant = $item.system.grants[grantId];
</script>

<Section
    heading="Contexts"
    hint="The context determines when the damage bonus applies"
    --a5e-section-body-gap="0.75rem"
>
    {#each contextMap as context}
        {#if context.component === "TagGroup"}
            <CheckBoxGroup
                heading={context.heading}
                options={context.options}
                selected={getProperty(grant, context.selectedProperty)}
                showToggleAllButton={true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue(context.selectedProperty, detail);
                }}
            />
        {:else if context.component === "Checkbox"}
            <Checkbox
                label={context.heading}
                checked={getProperty(grant, context.selectedProperty)}
                on:updateSelection={({ detail }) => {
                    onUpdateValue(context.selectedProperty, detail);
                }}
            />
        {:else if context.component === "Number"}
            <FieldWrapper
                heading={context.heading}
                --background="none"
                --padding="0"
                --margin="0 0 0.5rem 0 "
            >
                <input
                    type="number"
                    value={getProperty(grant, context.selectedProperty) ?? 0}
                    on:change={({ target }) => {
                        onUpdateValue(
                            context.selectedProperty,
                            Number(target.value),
                        );
                    }}
                />
            </FieldWrapper>
        {/if}
    {/each}
</Section>
