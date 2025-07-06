<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        reload?: boolean;
    };

    let { reload = $bindable() }: Props = $props();

    let settings: Record<string, { data: any; value: any }> =
        getContext("settings");
    let updates: Map<string, any> = getContext("updates");

    // Stores
    let critCalculationMode = $derived(settings["critCalculationMode"].value);
    let preventActivationRoll = $derived(
        settings["preventActionRollOnWarning"].value,
    );

    let selectedCritMode = $derived(
        updates.get("critCalculationMode") ?? critCalculationMode,
    );

    const critCalculationModeOptions =
        settings.critCalculationMode.data.choices;
</script>

<Section heading="Generic Roll Settings" --a5e-section-body-gap="0.5rem">
    <RadioGroup
        hint="A5E.settings.hints.critCalculationMode"
        options={Object.entries(critCalculationModeOptions)}
        selected={selectedCritMode}
        onUpdateSelection={(detail) => {
            updates.set("critCalculationMode", detail);
            selectedCritMode = detail;
        }}
    />

    <FieldWrapper hint="A5E.settings.hints.preventActionRollOnWarning">
        <Checkbox
            label="A5E.settings.preventActionRollOnWarning"
            checked={updates.get("preventActionRollOnWarning") ??
                preventActivationRoll ??
                false}
            onUpdateSelection={(detail) => {
                updates.set("preventActionRollOnWarning", detail);
            }}
        />
    </FieldWrapper>
</Section>
