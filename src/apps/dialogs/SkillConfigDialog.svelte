<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import Checkbox from "../components/Checkbox.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareAbilityOptions from "../dataPreparationHelpers/prepareAbilityOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { document, appId, skillKey } =
        getContext("#external").application;

    const actor = new TJSDocument(document);
    const abilityOptions = prepareAbilityOptions();

    const specialtyOptions = Object.entries(
        CONFIG.A5E.skillSpecialties[skillKey],
    );

    $: skill = $actor.system.skills[skillKey];
</script>

<article>
    <FormSection>
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
    </FormSection>

    <FormSection heading="A5E.AbilityScore">
        <RadioGroup
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
    </FormSection>

    {#if !game.settings.get("a5e", "hideSkillSpecialties")}
        <FormSection>
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
        </FormSection>
    {/if}

    <FormSection heading="A5E.ExpertiseDie">
        <ExpertiseDiePicker
            selected={skill.expertiseDice}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.skills.${skillKey}.expertiseDice`,
                    detail,
                )}
        />
    </FormSection>

    <FormSection heading="A5E.MinimumD20Roll" --direction="column">
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
    </FormSection>
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
