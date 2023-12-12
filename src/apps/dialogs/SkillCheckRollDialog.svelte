<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import getRollFormula from "../../utils/getRollFormula";
    import overrideRollMode from "../../utils/overrideRollMode";
    import prepareAbilityBonuses from "../dataPreparationHelpers/prepareAbilityBonuses";
    import prepareSkillBonuses from "../dataPreparationHelpers/prepareSkillBonuses";

    export let { actorDocument, dialog, skillKey, options } =
        getContext("#external").application;

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    const actor = new TJSDocument(actorDocument);
    const appId = dialog.id;

    const localizedSkill = localize(CONFIG.A5E.skills[skillKey]);
    const abilities = { none: "A5E.None", ...CONFIG.A5E.abilities };

    const buttonText = localize("A5E.RollPromptAbilityCheck", {
        ability: localizedSkill,
    });

    function getDefaultSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (value.default ?? true) acc.push(key);
                return acc;
            }, []);
    }

    function onSubmit() {
        dialog.submit({
            expertiseDie,
            rollFormula,
            abilityKey,
            rollMode,
            visibilityMode,
        });
    }

    let abilityKey =
        options.abilityKey ?? $actor.system.skills[skillKey].ability;

    let expertiseDie =
        options.expertiseDice ?? $actor.system.skills[skillKey].expertiseDice;

    let visibilityMode =
        options.visibilityMode ?? game.settings.get("core", "rollMode");

    let { minRoll } = options.minRoll ?? $actor.system.skills[skillKey];
    let rollFormula;
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let situationalMods = options.situationalMods ?? "";

    const abilityBonuses = prepareAbilityBonuses($actor, abilityKey, "check");
    const skillBonuses = prepareSkillBonuses($actor, skillKey);
    let selectedAbilityBonuses = getDefaultSelections({ abilityBonuses });
    let selectedSkillBonuses = getDefaultSelections({ skillBonuses });

    let rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        skill: skillKey,
        type: "skill",
    });

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        minRoll,
        rollMode,
        situationalMods,
        skill: skillKey,
        selectedAbilityBonuses,
        selectedSkillBonuses,
        type: "skillCheck",
    });
</script>

<form>
    <OutputVisibilitySection bind:visibilityMode />

    <FormSection heading="A5E.RollModeHeading">
        <RadioGroup
            options={rollModeOptions}
            selected={rollMode}
            on:updateSelection={({ detail }) => (rollMode = detail)}
        />
    </FormSection>

    <FormSection heading="A5E.AbilityScore">
        <RadioGroup
            options={Object.entries(abilities)}
            selected={abilityKey}
            on:updateSelection={({ detail }) => (abilityKey = detail)}
        />
    </FormSection>

    <FormSection heading="A5E.ExpertiseDie">
        <ExpertiseDiePicker
            selected={expertiseDie}
            on:updateSelection={({ detail }) => (expertiseDie = detail)}
        />
    </FormSection>

    {#if Object.values(abilityBonuses).flat().length}
        <FormSection heading="Ability Bonuses">
            <CheckboxGroup
                options={abilityBonuses.map(([key, abilityBonus]) => [
                    key,
                    abilityBonus.label || abilityBonus.defaultLabel,
                ])}
                selected={selectedAbilityBonuses}
                on:updateSelection={({ detail }) =>
                    (selectedAbilityBonuses = detail)}
            />
        </FormSection>
    {/if}

    {#if Object.values(skillBonuses).flat().length}
        <FormSection heading="Skill Bonuses">
            <CheckboxGroup
                options={skillBonuses.map(([key, skillBonus]) => [
                    key,
                    skillBonus.label || skillBonus.defaultLabel,
                ])}
                selected={selectedSkillBonuses}
                on:updateSelection={({ detail }) =>
                    (selectedSkillBonuses = detail)}
            />
        </FormSection>
    {/if}

    <FormSection heading="A5E.SituationalMods">
        <input
            class="a5e-input"
            type="text"
            id="{$actor.id}-{appId}-situational-mods"
            bind:value={situationalMods}
        />
    </FormSection>

    <section class="roll-formula-preview">
        {rollFormula}
    </section>

    <section>
        <button on:click|preventDefault={onSubmit}>{buttonText}</button>
    </section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
