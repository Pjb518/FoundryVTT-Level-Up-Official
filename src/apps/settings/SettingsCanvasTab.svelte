<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    export let reload;

    const settings = getContext("settings");
    const updates = getContext("updates");

    const diagonalRuleOptions =
        game.settings.settings.get("a5e.diagonalRule").choices;

    let visionRules = settings.getStore("automateVisionRules");
    let diagonalRule = settings.getStore("diagonalRule");
    let selectedDiagonalRule = updates.get("diagonalRule") ?? $diagonalRule;
    let placeTemplate = settings.getStore("placeItemTemplateDefault");
</script>

<Section heading="VIsion Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.automateVisionRules">
        <Checkbox
            label="A5E.settings.automateVisionRules"
            checked={updates.get("automateVisionRules") ??
                $visionRules ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("automateVisionRules", detail);
                reload = true;
            }}
        />
    </FieldWrapper>
</Section>

<Section heading="Grid Settings" --a5e-section-body-gap="0.5rem">
    <RadioGroup
        hint="A5E.settings.hints.diagonalRule"
        options={Object.entries(diagonalRuleOptions)}
        selected={selectedDiagonalRule}
        on:updateSelection={({ detail }) => {
            updates.set("diagonalRule", detail);
            selectedDiagonalRule = detail;
            reload = true;
        }}
    />
</Section>

<Section heading="Template Settings" --a5e-section-body-gap="0.5rem">
    <FieldWrapper hint="A5E.settings.hints.placeItemTemplateDefault">
        <Checkbox
            label="A5E.settings.placeItemTemplateDefault"
            checked={updates.get("placeItemTemplateDefault") ??
                $placeTemplate ??
                false}
            on:updateSelection={({ detail }) => {
                updates.set("placeItemTemplateDefault", detail);
            }}
        />
    </FieldWrapper>
</Section>
