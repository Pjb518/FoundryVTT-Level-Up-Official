<script lang="ts">
    import type { InitiativeRollOptions } from "../../../documents/actor/data.ts";

    import getRollFormula from "#utils/getRollFormula.js";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import RollModePicker from "#view/components/RollModePicker.svelte";

    type Props = {
        document: any;
        dialog: any;
        options: InitiativeRollOptions;
    };

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return actor.RollOverrideManager.getExpertiseDice(
            "initiative",
            options.expertiseDice ?? 0,
            {
                ability: abilityKey,
                skill: skillKey,
            },
        );
    }

    let { document, dialog, options }: Props = $props();

    const actor = document;
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
        actor.system.attributes.initiative.ability ??
        "dex";

    let skillKey = options.skillKey ?? "none";
    let situationalMods = options.situationalMods ?? "";
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;

    let expertiseDie = getInitialExpertiseDieSelection();

    let expertiseDieSource = actor.RollOverrideManager.getExpertiseDiceSource(
        "initiative",
        options.expertiseDie ?? 0,
        { ability: abilityKey, skill: skillKey },
    );

    let rollMode = actor.RollOverrideManager.getRollOverride(
        "initiative",
        selectedRollMode,
        {
            ability: abilityKey,
            skill: skillKey,
        },
    );

    let rollModeString = actor.RollOverrideManager.getRollOverridesSource(
        "initiative",
        selectedRollMode,
        { ability: abilityKey, skill: skillKey },
    );

    let abilityBonuses = actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "check",
    );

    let skillBonuses = actor.BonusesManager.prepareSkillBonuses(
        skillKey,
        abilityKey,
    );

    let initiativeBonuses = actor.BonusesManager.prepareInitiativeBonuses({
        abilityKey,
        skillKey,
    });

    let selectedAbilityBonuses = actor.BonusesManager.getDefaultSelections(
        "abilities",
        {
            abilityKey,
            abilityType: "check",
        },
    );

    let selectedSkillBonuses = actor.BonusesManager.getDefaultSelections(
        "skills",
        {
            skillKey,
            abilityKey,
        },
    );

    let selectedInitiativeBonuses = actor.BonusesManager.getDefaultSelections(
        "initiative",
        {
            abilityKey,
            skillKey,
        },
    );

    let rollFormula = $derived(
        getRollFormula(actor, {
            ability: abilityKey,
            expertiseDie,
            rollMode,
            situationalMods,
            skill: skillKey,
            selectedAbilityBonuses,
            selectedSkillBonuses,
            selectedInitiativeBonuses,
            type: "initiative",
        }),
    );
</script>

<form>
    <RollModePicker
        selected={rollMode}
        source={rollModeString}
        onUpdateSelection={(detail) => (rollMode = detail)}
    />

    <RadioGroup
        heading="A5E.abilities.headings.score"
        options={Object.entries(abilities)}
        selected={abilityKey}
        onUpdateSelection={(detail) => (abilityKey = detail)}
    />

    <RadioGroup
        heading="A5E.skillLabels.title"
        options={Object.entries(skills)}
        selected={skillKey}
        onUpdateSelection={(detail) => (skillKey = detail)}
    />

    <ExpertiseDiePicker
        source={expertiseDieSource}
        selected={expertiseDie}
        type={actor.type}
        onUpdateSelection={(value) => {
            expertiseDie = value;
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
            onUpdateSelection={(detail) => (selectedAbilityBonuses = detail)}
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
            onUpdateSelection={(detail) => (selectedSkillBonuses = detail)}
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
            onUpdateSelection={(detail) => (selectedInitiativeBonuses = detail)}
        />
    {/if}

    <FieldWrapper heading="A5E.SituationalMods">
        <input
            class="a5e-input a5e-input--slim"
            type="text"
            id="{actor.id}-{appId}-situational-mods"
            bind:value={situationalMods}
        />
    </FieldWrapper>

    <section class="roll-formula-preview">
        {rollFormula}
    </section>

    <section>
        <button
            onclick={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            Roll Initiative
        </button>
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
        font-size: var(--a5e-sm-text);
        border: 1px solid var(--a5e-border-color);
        border-radius: 4px;
    }
</style>
