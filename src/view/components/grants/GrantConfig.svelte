<script lang="ts">
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    function onUpdateValue(key: string, value: string | number) {
        key = `system.grants.${grantId}.${key}`;
        updateDocumentDataFromField(item, key, value);
    }

    let { children = undefined } = $props();
    let item: any = getContext("item");
    let grantId: string = getContext("grantId");

    const levelTypes = CONFIG.A5E.classLevelTypes;

    let grant = $derived(item.reactive.system.grants[grantId]);
</script>

<Section heading="Grant Config" --a5e-section-body-gap="0.75rem">
    {@render children?.()}

    <FieldWrapper heading="A5E.grants.headings.level">
        <input
            class="a5e-input a5e-input--slim a5e-input--small"
            type="number"
            value={grant.level ?? 1}
            min="1"
            onchange={({ currentTarget }) => {
                onUpdateValue(
                    "level",
                    Math.max(Number(currentTarget.value), 1),
                );
            }}
        />
    </FieldWrapper>

    <RadioGroup
        heading="A5E.classes.levelType"
        options={Object.entries(levelTypes)}
        selected={grant.levelType}
        allowDeselect={false}
        onUpdateSelection={(value) => onUpdateValue("levelType", value)}
    />

    <Checkbox
        label="Mark grant as optional"
        checked={grant.optional ?? false}
        onUpdateSelection={(value) => onUpdateValue("optional", value)}
    />
</Section>
