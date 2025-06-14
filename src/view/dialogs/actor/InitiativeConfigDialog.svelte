<script lang="ts">
    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
    };

    let { document }: Props = $props();

    const actor = document;
    const abilityOptions = prepareAbilityOptions();

    let expertiseDice = $derived(
        actor.reactive._source.system.attributes.initiative.expertiseDice,
    );
</script>

<Section --a5e-section-body-gap="0.75rem" --a5e-section-padding="0.75rem">
    <RadioGroup
        heading="A5E.abilities.headings.score"
        optionStyles="min-width:2rem; text-align: center;"
        options={abilityOptions}
        selected={actor.reactive.system.attributes.initiative.ability}
        allowDeselect={false}
        onUpdateSelection={(value) =>
            updateDocumentDataFromField(
                actor,
                "system.attributes.initiative.ability",
                value,
            )}
    />

    <ExpertiseDiePicker
        selected={expertiseDice}
        type={actor.type}
        onUpdateSelection={(value) =>
            updateDocumentDataFromField(
                actor,
                `system.attributes.initiative.expertiseDice`,
                value,
            )}
    />
</Section>
