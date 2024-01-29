<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    // export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    // Stores
    let critCalculationMode = settings.getStore("critCalculationMode");
    let selectedCritMode =
        updates.get("critCalculationMode") ?? $critCalculationMode;
    const critCalculationModeOptions = game.settings.settings.get(
        "a5e.critCalculationMode",
    ).choices;

    let preventActivationRoll = settings.getStore("preventActionRollOnWarning");
</script>

<Section heading="Generic Roll Settings" --a5e-section-body-gap="0.5rem">
    <RadioGroup
        hint="A5E.settings.hints.critCalculationMode"
        options={Object.entries(critCalculationModeOptions)}
        selected={selectedCritMode}
        on:updateSelection={({ detail }) => {
            updates.set("critCalculationMode", detail);
            selectedCritMode = detail;
        }}
    />

    <FieldWrapper hint="A5E.settings.hints.preventActionRollOnWarning">
        <Checkbox
            label="A5E.settings.preventActionRollOnWarning"
            checked={updates.get("preventActionRollOnWarning") ??
                $preventActivationRoll ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("preventActionRollOnWarning", detail);
            }}
        />
    </FieldWrapper>
</Section>
