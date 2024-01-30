<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import getRollFormula from "../../utils/getRollFormula";
    import overrideRollMode from "../../utils/overrideRollMode";

    export let { document, dialog, skillKey, options } =
        getContext("#external").application;

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return (
            options.expertiseDice ??
            $actor.system.skills[skillKey].expertiseDice
        );
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

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    const actor = new TJSDocument(document);
    const appId = dialog.id;

    const localizedSkill = localize(CONFIG.A5E.skills[skillKey]);
    const abilities = { none: "A5E.None", ...CONFIG.A5E.abilities };
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

    const buttonText = localize("A5E.RollPromptAbilityCheck", {
        ability: localizedSkill,
    });

    let abilityKey =
        options.abilityKey ?? $actor.system.skills[skillKey].ability;

    let visibilityMode =
        options.visibilityMode ?? game.settings.get("core", "rollMode");

    let expertiseDie = getInitialExpertiseDieSelection();
    let { minRoll } = options.minRoll ?? $actor.system.skills[skillKey];
    let rollFormula;
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let situationalMods = options.situationalMods ?? "";

    $: abilityBonuses = $actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "check",
    );

    $: skillBonuses = $actor.BonusesManager.prepareSkillBonuses(
        skillKey,
        abilityKey,
    );

    $: selectedAbilityBonuses = $actor.BonusesManager.getDefaultSelections(
        "abilities",
        { abilityKey, abilityType: "check" },
    );

    $: selectedSkillBonuses = $actor.BonusesManager.getDefaultSelections(
        "skills",
        { skillKey, abilityKey },
    );

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

    <RadioGroup
        heading="A5E.RollModeHeading"
        options={rollModeOptions}
        selected={rollMode}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (rollMode = detail)}
    />

    <RadioGroup
        heading="A5E.AbilityScore"
        options={Object.entries(abilities)}
        selected={abilityKey}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (abilityKey = detail)}
    />

    <ExpertiseDiePicker
        selected={expertiseDie}
        type={$actor.type}
        on:updateSelection={({ detail }) => (expertiseDie = detail)}
    />

    {#if Object.values(abilityBonuses).flat().length}
        <CheckboxGroup
            heading="Ability Bonuses"
            options={abilityBonuses.map(([key, abilityBonus]) => [
                key,
                abilityBonus.label || abilityBonus.defaultLabel,
            ])}
            selected={selectedAbilityBonuses}
            on:updateSelection={({ detail }) =>
                (selectedAbilityBonuses = detail)}
        />
    {/if}

    {#if Object.values(skillBonuses).flat().length}
        <CheckboxGroup
            heading="Skill Bonuses"
            options={skillBonuses.map(([key, skillBonus]) => [
                key,
                skillBonus.label || skillBonus.defaultLabel,
            ])}
            selected={selectedSkillBonuses}
            on:updateSelection={({ detail }) => (selectedSkillBonuses = detail)}
        />
    {/if}

    <FieldWrapper heading="A5E.SituationalMods">
        <input
            class="a5e-input"
            type="text"
            id="{$actor.id}-{appId}-situational-mods"
            bind:value={situationalMods}
        />
    </FieldWrapper>

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
