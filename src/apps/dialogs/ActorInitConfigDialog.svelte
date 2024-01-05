<script>
    import { getContext } from "svelte";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    import prepareAbilityOptions from "../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId } = getContext("#external").application;

    const actor = document;
    const abilityOptions = prepareAbilityOptions();

    $: initiative = $actor.system.attributes.initiative;
</script>

<Section
    --a5e-section-body-gap="0.75rem"
    --a5e-section-margin="0"
    --a5e-section-padding="0.75rem"
>
    <RadioGroup
        heading="A5E.AbilityScore"
        optionStyles="min-width:2rem; text-align: center;"
        options={abilityOptions}
        selected={$actor.system.attributes.initiative.ability}
        allowDeselect={false}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                "system.attributes.initiative.ability",
                event.detail,
            )}
    />

    <ExpertiseDiePicker
        selected={initiative.expertiseDice}
        on:updateSelection={(event) =>
            updateDocumentDataFromField(
                $actor,
                `system.attributes.initiative.expertiseDice`,
                event.detail,
            )}
    />

    <FieldWrapper
        heading="A5E.InitiativeBonus"
        hint="This field accepts any values valid in roll formulae."
    >
        <input
            class="a5e-input"
            type="text"
            name="system.attributes.initiative.bonus"
            value={initiative.bonus}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
        />
    </FieldWrapper>
</Section>
