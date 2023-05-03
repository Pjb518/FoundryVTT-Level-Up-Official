<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";

    const appId = getContext("appId");

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

    $: selectedConditions = game.settings.get();
</script>

<!-- Condition Automation -->
<FormSection heading="A5E.settings.automateConditions">
    <CheckboxGroup options={conditions} />
</FormSection>
