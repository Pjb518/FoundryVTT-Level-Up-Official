<script lang="ts">
    import { getContext } from "svelte";

    import getContextsMap from "#utils/getContextsMap.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CheckBoxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    function onUpdateValue(key: string, value: string) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    let item: Item = getContext("item");
    let grantId: string = getContext("grantId");
    let grantType: string = getContext("grantType");
    const getProperty = foundry.utils.getProperty;
    const contextMap = getContextsMap("grant", grantType);

    let grant = $derived(item.reactive.system.grants[grantId]);
    $inspect(grant);
</script>

<Section
    heading="Contexts"
    hint="The context determines when the bonus applies"
    --a5e-section-body-gap="0.75rem"
>
    {#each contextMap as context}
        {#if context.component === "TagGroup"}
            <CheckBoxGroup
                heading={context.heading}
                options={context.options}
                selected={getProperty(grant, context.selectedProperty)}
                showToggleAllButton={true}
                onUpdateSelection={(value) => {
                    onUpdateValue(context.selectedProperty, value);
                }}
            />
        {:else if context.component === "Checkbox"}
            <Checkbox
                label={context.heading}
                checked={getProperty(grant, context.selectedProperty)}
                onUpdateSelection={(value) => {
                    onUpdateValue(context.selectedProperty, value);
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
                    class="a5e-input a5e-input--slim a5e-input--small"
                    type="number"
                    value={getProperty(grant, context.selectedProperty) ?? 0}
                    onchange={({ currentTarget }) => {
                        onUpdateValue(
                            context.selectedProperty,
                            Number(currentTarget.value),
                        );
                    }}
                />
            </FieldWrapper>
        {:else if context.component === "String"}
            <FieldWrapper
                heading={context.heading}
                --background="none"
                --padding="0"
                --margin="0 0 0.5rem 0 "
            >
                <input
                    type="text"
                    value={getProperty(grant, context.selectedProperty) || ""}
                    onchange={({ currentTarget }) => {
                        onUpdateValue(
                            context.selectedProperty,
                            currentTarget.value,
                        );
                    }}
                />
            </FieldWrapper>
        {/if}
    {/each}
</Section>
