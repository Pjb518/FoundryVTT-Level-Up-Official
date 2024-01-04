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
    import prepareAbilityBonuses from "../dataPreparationHelpers/prepareAbilityBonuses";
    import prepareSkillBonuses from "../dataPreparationHelpers/prepareSkillBonuses";

    export let { document, dialog, options } =
        getContext("#external").application;

    function getDefaultSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (value.default ?? true) acc.push(key);
                return acc;
            }, []);
    }

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

    let rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        type: "initiative",
    });

    $: abilityBonuses = prepareAbilityBonuses($actor, abilityKey, "check");
    $: skillBonuses = prepareSkillBonuses($actor, skillKey, "check");
    $: selectedAbilityBonuses = getDefaultSelections({ abilityBonuses });
    $: selectedSkillBonuses = getDefaultSelections({ skillBonuses });

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        situationalMods,
        skill: skillKey,
        selectedAbilityBonuses,
        selectedSkillBonuses,
        type: "initiative",
    });
</script>

<form>
    <FieldWrapper heading="A5E.RollModeHeading">
        <RadioGroup
            options={rollModeOptions}
            selected={rollMode}
            on:updateSelection={({ detail }) => (rollMode = detail)}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.AbilityScore">
        <RadioGroup
            options={Object.entries(abilities)}
            selected={abilityKey}
            on:updateSelection={({ detail }) => (abilityKey = detail)}
        />
    </FieldWrapper>

    <FieldWrapper heading="A5E.Skill">
        <RadioGroup
            options={Object.entries(skills)}
            selected={skillKey}
            on:updateSelection={({ detail }) => (skillKey = detail)}
        />
    </FieldWrapper>

    <ExpertiseDiePicker
        selected={expertiseDie}
        on:updateSelection={(event) => {
            expertiseDie = event.detail;
        }}
    />

    {#if Object.values(abilityBonuses).flat().length}
        <FieldWrapper heading="Ability Bonuses">
            <CheckboxGroup
                options={abilityBonuses.map(([key, abilityBonus]) => [
                    key,
                    abilityBonus.label || abilityBonus.defaultLabel,
                ])}
                selected={selectedAbilityBonuses}
                on:updateSelection={({ detail }) =>
                    (selectedAbilityBonuses = detail)}
            />
        </FieldWrapper>
    {/if}

    {#if Object.values(skillBonuses).flat().length}
        <FieldWrapper heading="Skill Bonuses">
            <CheckboxGroup
                options={skillBonuses.map(([key, skillBonus]) => [
                    key,
                    skillBonus.label || skillBonus.defaultLabel,
                ])}
                selected={selectedSkillBonuses}
                on:updateSelection={({ detail }) =>
                    (selectedSkillBonuses = detail)}
            />
        </FieldWrapper>
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

    .heading {
        display: block;
        font-weight: bold;
        font-size: $font-size-sm;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
