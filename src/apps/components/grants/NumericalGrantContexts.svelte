<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getContextsMap from "../../../utils/getContextsMap";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";
    import TagGroup from "../TagGroup.svelte";

    const item = getContext("item");
    const grantId = getContext("grantId");
    const grantType = getContext("grantType");
    const getProperty = foundry.utils.getProperty;
    const contextMap = getContextsMap("grant", grantType);

    console.log(contextMap);

    function onUpdateValue(key, value) {
        console.log(key, value);
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField($item, key, value);
    }

    $: grant = $item.system.grants[grantId];
</script>

<FormSection
    heading="Contexts"
    hint="The context determines when the damage bonus applies"
    --direction="column"
    --wrap="nowrap"
>
    {#each contextMap as context}
        {#if context.component === "TagGroup"}
            <TagGroup
                heading={context.heading}
                options={context.options}
                selected={getProperty(grant, context.selectedProperty)}
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
            <FormSection
                heading={context.heading}
                --background="none"
                --padding="0"
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
            </FormSection>
        {/if}
    {/each}
</FormSection>
