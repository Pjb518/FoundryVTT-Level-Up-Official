<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import CustomTagGroup from "../components/CustomTagGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import prepareAbilityOptions from "../dataPreparationHelpers/prepareAbilityOptions";
    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";
    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let { actorDocument, appId, skillKey } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const abilityOptions = prepareAbilityOptions();
    const expertiseDiceOptions = prepareExpertiseDiceOptions();

    const checkBonusHeading = localize("A5E.SkillCheckBonus", {
        skill: localize(CONFIG.A5E.skills[skillKey]),
    });

    const specialtyOptions = Object.entries(
        CONFIG.A5E.skillSpecialties[skillKey]
    );

    const passiveBonusHeading = localize("A5E.SkillCheckBonusPassive", {
        skill: localize(CONFIG.A5E.skills[skillKey]),
    });

    $: skill = $actor.system.skills[skillKey];
</script>

<article>
    <FormSection>
        <div class="u-align-center u-flex u-gap-md">
            <input
                class="u-pointer"
                type="checkbox"
                id="{appId}-{skillKey}-proficient"
                name="system.skills.{skillKey}.proficient"
                checked={skill.proficient}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.checked
                    )}
            />

            <label for="{appId}-{skillKey}-proficient" class="u-pointer">
                {localize("A5E.ProficiencyProficient")}
            </label>
        </div>
    </FormSection>

    <FormSection heading="A5E.AbilityScore">
        <RadioGroup
            optionStyles="min-width:2rem; text-align: center;"
            options={abilityOptions}
            selected={skill.ability}
            allowDeselect={false}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.skills.${skillKey}.ability`,
                    event.detail
                )}
        />
    </FormSection>

    <FormSection>
        <CustomTagGroup
            heading="A5E.SkillSpecialties"
            options={specialtyOptions}
            selected={skill.specialties}
            on:updateSelection={(event) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.skills.${skillKey}.specialties`,
                    event.detail
                )}
        />
    </FormSection>

    <FormSection heading="A5E.ExpertiseDie">
        <ExpertiseDiePicker
            selected={skill.expertiseDice}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $actor,
                    `system.skills.${skillKey}.expertiseDice`,
                    detail
                )}
        />
    </FormSection>

    <FormSection
        heading={checkBonusHeading}
        hint="This field accepts any values in roll formulae."
    >
        <div class="u-w-full">
            <input
                class="a5e-input"
                type="text"
                name="system.skills.{skillKey}.bonuses.check"
                value={skill.bonuses.check}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </div>
    </FormSection>

    <FormSection heading={passiveBonusHeading}>
        <div class="u-w-full">
            <input
                class="a5e-input"
                type="number"
                data-dtype="Number"
                name="system.skills.{skillKey}.bonuses.passive"
                value={skill.bonuses.passive}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        Number(target.value)
                    )}
            />
        </div>
    </FormSection>

    <FormSection
        heading="A5E.SkillCheckBonusGlobal"
        hint="This bonus is added to all skill modifiers. This field accepts any values valid in roll formulae."
    >
        <div class="u-w-full">
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.abilities.skill"
                value={$actor.system.bonuses.abilities.skill}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </div>
    </FormSection>

    <FormSection
        heading="A5E.AbilityCheckBonusGlobal"
        hint="This bonus is added to all ability check modifiers, including skill modifiers. This field accepts any values valid in roll formulae."
    >
        <div class="u-w-full">
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.abilities.check"
                value={$actor.system.bonuses.abilities.check}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </div>
    </FormSection>

    <FormSection heading="A5E.MinimumD20Roll">
        <div class="u-w-full">
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    type="number"
                    data-dtype="Number"
                    name="system.skills.{skillKey}.minRoll"
                    value={skill.minRoll}
                    min="0"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value)
                        )}
                />
            </div>
        </div>
    </FormSection>
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: min(90vh, 52rem);
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
