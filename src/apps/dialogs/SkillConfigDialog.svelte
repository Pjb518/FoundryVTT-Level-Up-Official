<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    import prepareAbilityOptions from "../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId, skillKey } =
        getContext("#external").application;

    const actor = document;
    const abilityOptions = prepareAbilityOptions();

    const specialtyOptions = Object.entries(
        CONFIG.A5E.skillSpecialties[skillKey],
    );

    let hideSkillSpecialties =
        game.settings.get("a5e", "hideSkillSpecialties") ?? false;

    $: skill = $actor.system.skills[skillKey];
</script>

<article>
    <Section --a5e-section-body-gap="0.75rem">
        <FieldWrapper>
            <Checkbox
                label="A5E.ProficiencyProficient"
                checked={skill.proficient}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        `system.skills.${skillKey}.proficient`,
                        detail,
                    );
                }}
            />
        </FieldWrapper>

        {#if !hideSkillSpecialties}
            <CustomTagGroup
                heading="A5E.SkillSpecialties"
                options={specialtyOptions}
                selected={skill.specialties}
                on:updateSelection={(event) =>
                    updateDocumentDataFromField(
                        $actor,
                        `system.skills.${skillKey}.specialties`,
                        event.detail,
                    )}
            />
        {/if}

        <RadioGroup
            heading="A5E.AbilityScore"
            optionStyles="min-width:2rem; text-align: center;"
            options={[
                ...abilityOptions,
                ["@attributes.spellcasting", "Spellcasting"],
            ]}
            selected={$actor._source.system.skills[skillKey].ability}
            allowDeselect={false}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.skills.${skillKey}.ability`,
                    event.detail,
                )}
        />

        <ExpertiseDiePicker
            selected={skill.expertiseDice}
            type={$actor.type}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.skills.${skillKey}.expertiseDice`,
                    detail,
                )}
        />

        <FieldWrapper heading="A5E.MinimumD20Roll" --direction="column">
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    type="number"
                    value={skill.minRoll}
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            `system.skills.${skillKey}.minRoll`,
                            Number(target.value),
                        )}
                />
            </div>
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
        background: $color-sheet-background;
    }
</style>
