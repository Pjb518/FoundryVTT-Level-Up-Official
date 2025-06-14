<script lang="ts">
    import { prepareAbilityOptions } from "#utils/view/helpers/prepareAbilityOptions.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import CustomTagGroup from "#view/snippets/CustomTagGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: any;
        skillKey: string;
    };

    let { document, skillKey }: Props = $props();

    const actor = document;
    const abilityOptions = prepareAbilityOptions();

    const specialtyOptions = Object.entries(
        CONFIG.A5E.skillSpecialties[skillKey],
    );

    let dnd5eStyleExpertise = game.settings.get(
        "a5e",
        "5eStyleExpertise",
    ) as boolean;

    let hideSkillSpecialties =
        (game.settings.get("a5e", "hideSkillSpecialties") as boolean) ?? false;

    let skill = $derived(actor.reactive.system.skills[skillKey]);
</script>

<article>
    <Section --a5e-section-body-gap="0.75rem">
        <FieldWrapper>
            {#if dnd5eStyleExpertise}
                <RadioGroup
                    heading="Proficiency Level"
                    options={[
                        [0, "None"],
                        [1, "Proficient"],
                        [2, "Expertise"],
                    ]}
                    selected={skill.proficient}
                    allowDeselect={false}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(
                            actor,
                            `system.skills.${skillKey}.proficient`,
                            value,
                        );
                    }}
                ></RadioGroup>
            {:else}
                <Checkbox
                    label="A5E.proficiency.proficient"
                    checked={skill.proficient}
                    onUpdateSelection={(value) => {
                        updateDocumentDataFromField(
                            actor,
                            `system.skills.${skillKey}.proficient`,
                            value,
                        );
                    }}
                />
            {/if}
        </FieldWrapper>

        {#if !hideSkillSpecialties}
            <CustomTagGroup
                heading="A5E.skillLabels.specialties"
                options={specialtyOptions}
                selected={skill.specialties}
                onUpdateSelection={(value) =>
                    updateDocumentDataFromField(
                        actor,
                        `system.skills.${skillKey}.specialties`,
                        value,
                    )}
            />
        {/if}

        <RadioGroup
            heading="A5E.abilities.headings.score"
            optionStyles="min-width:2rem; text-align: center;"
            options={[
                ...abilityOptions,
                ["@attributes.spellcasting", "Spellcasting"],
            ]}
            selected={actor.reactive._source.system.skills[skillKey].ability}
            allowDeselect={false}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    actor,
                    `system.skills.${skillKey}.ability`,
                    value,
                )}
        />

        <ExpertiseDiePicker
            selected={actor.reactive._source.system.skills[skillKey]
                ?.expertiseDice}
            type={actor.type}
            onUpdateSelection={(value) =>
                updateDocumentDataFromField(
                    actor,
                    `system.skills.${skillKey}.expertiseDice`,
                    value,
                )}
        />

        <FieldWrapper heading="A5E.MinimumD20Roll" --direction="column">
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
                type="number"
                value={skill.minRoll}
                min="0"
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        actor,
                        `system.skills.${skillKey}.minRoll`,
                        Number(currentTarget.value),
                    )}
            />
        </FieldWrapper>
    </Section>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
    }
</style>
