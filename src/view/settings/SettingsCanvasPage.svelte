<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    let visionRules = $derived(settings["automateVisionRules"].value);
    let charOnlyVisionRules = $derived(
        settings["visionRulesApplyToCharactersOnly"].value,
    );
    let placeTemplate = $derived(settings["placeItemTemplateDefault"].value);
</script>

<Section heading="VIsion Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.automateVisionRules">
        <Checkbox
            label="A5E.settings.automateVisionRules"
            checked={updates.get("automateVisionRules") ?? visionRules ?? false}
            onUpdateSelection={(detail) => {
                updates.set("automateVisionRules", detail);
                reload = true;
            }}
        />
    </FieldWrapper>

    {#if visionRules}
        <FieldWrapper
            hint="A5E.settings.hints.visionRulesApplyToCharactersOnly"
        >
            <Checkbox
                label="A5E.settings.visionRulesApplyToCharactersOnly"
                checked={updates.get("visionRulesApplyToCharactersOnly") ??
                    charOnlyVisionRules ??
                    true}
                onUpdateSelection={(detail) => {
                    updates.set("visionRulesApplyToCharactersOnly", detail);
                    reload = true;
                }}
            />
        </FieldWrapper>
    {/if}
</Section>

<Section heading="Template Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.placeItemTemplateDefault">
        <Checkbox
            label="A5E.settings.placeItemTemplateDefault"
            checked={updates.get("placeItemTemplateDefault") ??
                placeTemplate ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("placeItemTemplateDefault", detail);
            }}
        />
    </FieldWrapper>
</Section>
