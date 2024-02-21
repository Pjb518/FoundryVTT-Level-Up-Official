<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import getRollFormula from "../../utils/getRollFormula";
    import overrideRollMode from "../../utils/overrideRollMode";

    export let { document, dialog, options } =
        getContext("#external").application;

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return (
            options.expertiseDice ??
            $actor.system.attributes.initiative.expertiseDice
        );
    }

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    const actor = new TJSDocument(document.actor);
    const appId = dialog.id;
    const abilities = CONFIG.A5E.abilities;
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");
    const skills = { none: "None", ...CONFIG.A5E.skills };

    if (game.settings.get("a5e", "hideA5eSkills")) {
        delete skills.cul;
        delete skills.eng;
    }

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let abilityKey =
        options.abilityKey ??
        $actor.system.attributes.initiative.ability ??
        "dex";

    let expertiseDie = getInitialExpertiseDieSelection();
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let skillKey = options.skillKey ?? "none";
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";

    let rollMode = $actor.RollOverrideManager.getRollOverride(
        `initiative`,
        selectedRollMode,
    );

    let rollModeString = $actor.RollOverrideManager.getRollOverridesSource(
        `initiative`,
        selectedRollMode,
    );

    $: abilityBonuses = $actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "check",
    );

    $: skillBonuses = $actor.BonusesManager.prepareSkillBonuses(
        skillKey,
        abilityKey,
    );

    $: initiativeBonuses = $actor.BonusesManager.prepareInitiativeBonuses({
        abilityKey,
        skillKey,
    });

    $: selectedAbilityBonuses = $actor.BonusesManager.getDefaultSelections(
        "abilities",
        { abilityKey, abilityType: "check" },
    );

    $: selectedSkillBonuses = $actor.BonusesManager.getDefaultSelections(
        "skills",
        { skillKey, abilityKey },
    );

    $: selectedInitiativeBonuses = $actor.BonusesManager.getDefaultSelections(
        "initiative",
        { abilityKey, skillKey },
    );

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        situationalMods,
        skill: skillKey,
        selectedAbilityBonuses,
        selectedSkillBonuses,
        selectedInitiativeBonuses,
        type: "initiative",
    });
</script>

<form>
    <RadioGroup
        heading="A5E.RollModeHeading"
        ,
        buttons={[
            {
                classes: "fas fa-question-circle",
                tooltip: rollModeString,
            },
        ]}
        options={rollModeOptions}
        selected={rollMode}
        on:updateSelection={({ detail }) => (rollMode = detail)}
    />

    <RadioGroup
        heading="A5E.AbilityScore"
        options={Object.entries(abilities)}
        selected={abilityKey}
        on:updateSelection={({ detail }) => (abilityKey = detail)}
    />

    <RadioGroup
        heading="A5E.Skill"
        options={Object.entries(skills)}
        selected={skillKey}
        on:updateSelection={({ detail }) => (skillKey = detail)}
    />

    <ExpertiseDiePicker
        selected={expertiseDie}
        type={$actor.type}
        on:updateSelection={(event) => {
            expertiseDie = event.detail;
        }}
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

    {#if Object.values(initiativeBonuses).flat().length}
        <CheckboxGroup
            heading="Initiative Bonuses"
            options={initiativeBonuses.map(([key, initiativeBonus]) => [
                key,
                initiativeBonus.label || initiativeBonus.defaultLabel,
            ])}
            selected={selectedInitiativeBonuses}
            on:updateSelection={({ detail }) =>
                (selectedInitiativeBonuses = detail)}
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
        <button on:click|preventDefault={onSubmit}>Roll Initiative</button>
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
