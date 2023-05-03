<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    const appId = getContext("appId");
    const settings = getContext("settings");

    // Conditions Automation
    const conditions = [
        "blinded",
        "bloodied",
        "encumbered",
        // 'fatigue',
        // 'frightened',
        "grappled",
        "invisible",
        "paralyzed",
        "petrified",
        "poisoned",
        "prone",
        "rattled",
        "restrained",
        "slowed",
        // 'strife',
        "stunned",
        "unconscious",
    ].map((c) => [c, localize(`A5E.Condition${c.capitalize()}`)]);

    const automatedConditions = settings.getStore("automatedConditions");
</script>

<!-- Condition Automation -->
<FormSection heading="A5E.settings.automateConditions">
    <CheckboxGroup
        options={conditions}
        selected={$automatedConditions}
        on:updateSelection={({ detail }) => automatedConditions.set(detail)}
    />
</FormSection>
