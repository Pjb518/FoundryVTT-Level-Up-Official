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

    const initialAbilityKey =
        options.abilityKey ?? actor.system.attributes.initiative.ability ?? "dex";
    const initialSkillKey = options.skillKey ?? "none";

    let abilityKey = $state(initialAbilityKey);
    let skillKey = $state(initialSkillKey);
    let situationalMods = $state(options.situationalMods ?? "");
    let selectedRollMode = $state(options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL);

    let expertiseDie = $state(
        hideExpertiseDice
            ? 0
            : actor.RollOverrideManager.getExpertiseDice(
                  "initiative",
                  options.expertiseDice ?? 0,
                  {
                      ability: initialAbilityKey,
                      skill: initialSkillKey,
                  },
              ),
    );

    let manualExpertiseDie = $state(false);

    $effect(() => {
        if (!hideExpertiseDice && !manualExpertiseDie) {
            let baseDie = 0;
            if (skillKey && skillKey !== "none" && actor.system.skills[skillKey]) {
                baseDie = actor.system.skills[skillKey].expertiseDice ?? 0;
            }

            const newExpertiseDie = actor.RollOverrideManager.getExpertiseDice(
                "initiative",
                baseDie,
                {
                    ability: abilityKey,
                    skill: skillKey,
                },
            );

            expertiseDie = newExpertiseDie;
        }
    });

    let expertiseDieSource = $derived(
        actor.RollOverrideManager.getExpertiseDiceSource(
            "initiative",
            options.expertiseDie ?? 0,
            { ability: abilityKey, skill: skillKey },
        ),
    );

    let rollMode = $derived(
        actor.RollOverrideManager.getRollOverride("initiative", selectedRollMode, {
            ability: abilityKey,
            skill: skillKey,
        }),
    );

    let rollModeString = $derived(
        actor.RollOverrideManager.getRollOverridesSource("initiative", selectedRollMode, {
            ability: abilityKey,
            skill: skillKey,
        }),
    );

    let abilityBonuses = $derived(
        actor.BonusesManager.prepareAbilityBonuses(abilityKey, "check"),
    );

    let skillBonuses = $derived(
        actor.BonusesManager.prepareSkillBonuses(skillKey, abilityKey),
    );

    let initiativeBonuses = $derived(
        actor.BonusesManager.prepareInitiativeBonuses({
            abilityKey,
            skillKey,
        }),
    );

    let selectedAbilityBonuses = $state(
        actor.BonusesManager.getDefaultSelections("abilities", {
            abilityKey: initialAbilityKey,
            abilityType: "check",
        }),
    );

    let selectedSkillBonuses = $state(
        actor.BonusesManager.getDefaultSelections("skills", {
            skillKey: initialSkillKey,
            abilityKey: initialAbilityKey,
        }),
    );

    let selectedInitiativeBonuses = $state(
        actor.BonusesManager.getDefaultSelections("initiative", {
            abilityKey: initialAbilityKey,
            skillKey: initialSkillKey,
        }),
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
        onUpdateSelection={(detail) => (selectedRollMode = detail)}
    />

    <RadioGroup
        heading="A5E.abilities.headings.score"
        options={Object.entries(abilities)}
        selected={abilityKey}
        onUpdateSelection={(detail) => {
            abilityKey = detail;
            manualExpertiseDie = false;
        }}
    />

    <RadioGroup
        heading="A5E.skillLabels.title"
        options={Object.entries(skills)}
        selected={skillKey}
        onUpdateSelection={(detail) => {
            skillKey = detail;
            manualExpertiseDie = false;
        }}
    />

    <ExpertiseDiePicker
        source={expertiseDieSource}
        selected={expertiseDie}
        type={actor.type}
        onUpdateSelection={(value) => {
            expertiseDie = value;
            manualExpertiseDie = true;
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
            class="roll-initiative-button"
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

    .roll-initiative-button {
        width: 100%;
    }
</style>
