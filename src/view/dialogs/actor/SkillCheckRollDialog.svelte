<script lang="ts">
    import { RollOverrideManager } from "#managers/RollOverrideManagerN.ts";
    import getRollFormula from "#utils/getRollFormula.js";
    import { localize } from "#utils/localization/localize.ts";
    import OutputVisibilitySection from "#view/components/OutputVisibilitySection.svelte";
    import RollModePicker from "#view/components/RollModePicker.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import type { SkillCheckRollOptions } from "../../../documents/actor/data.ts";

    type Props = {
        document: Actor.OfType<"base">;
        dialog: any;
        skillKey: string;
        options: SkillCheckRollOptions;
    };

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice)
            return { expertiseDie: 0, expertiseDieSource: "" };

        const others = [] as any[];
        if (ability) others.push({ type: "ability", src: ability });
        if (options.expertiseDice && options.speciality) {
            others.push({
                type: "speciality",
                src: {
                    expertiseDice: options.expertiseDice || 0,
                    expertiseDieSources: {
                        override: null,
                        sources: [options.speciality],
                    },
                },
            });
        }

        const edData = RollOverrideManager.resolveExpertiseDie(skill, {
            others,
        });

        return {
            expertiseDie: edData.value,
            expertiseDieSource: edData.source,
        };
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

    let { document, dialog, skillKey, options }: Props = $props();

    const actor = document;
    const appId = dialog.id;

    const localizedSkill = localize(CONFIG.A5E.skills[skillKey]);
    const abilities = { none: "A5E.None", ...CONFIG.A5E.abilities };
    const hideExpertiseDice = game.settings.get(
        "a5e",
        "hideExpertiseDice",
    ) as boolean;

    const buttonText = localize("A5E.rollLabels.prompts.abilityCheck", {
        ability: localizedSkill,
    });

    let abilityKey = $state(
        options.abilityKey ?? actor.system.skills[skillKey].ability,
    );
    let ability = $derived(actor.reactive.system.abilities[abilityKey].check);

    let visibilityMode = $state(
        options.visibilityMode ?? game.settings.get("core", "messageMode"),
    );

    let skill = $state(actor.system.skills[skillKey]);
    let { minRoll } = options.minRoll ?? skill;
    let initialRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let situationalMods = $state(options.situationalMods ?? "");

    let abilityBonuses = $state(
        actor.BonusesManager.prepareAbilityBonuses(abilityKey, "check"),
    );

    let skillBonuses = $derived(
        actor.BonusesManager.prepareSkillBonuses(skillKey, abilityKey),
    );

    let selectedAbilityBonuses = $derived(
        actor.BonusesManager.getDefaultSelections("abilities", {
            abilityKey,
            abilityType: "check",
        }),
    );

    let selectedSkillBonuses = $derived(
        actor.BonusesManager.getDefaultSelections("skills", {
            skillKey,
            abilityKey,
        }),
    );

    let { expertiseDie, expertiseDieSource } = $derived(
        getInitialExpertiseDieSelection(),
    );

    let rollModeData = $derived(
        RollOverrideManager.resolveRollMode(skill, initialRollMode, {
            others: [{ type: "ability", src: ability }],
        }),
    );

    let rollMode = $derived(rollModeData.value);
    let rollModeString = $derived(rollModeData.source);

    let rollFormula = $derived(
        getRollFormula(actor, {
            ability: abilityKey,
            expertiseDie,
            minRoll,
            rollMode,
            situationalMods,
            skill: skillKey,
            selectedAbilityBonuses,
            selectedSkillBonuses,
            type: "skillCheck",
        }),
    );
</script>

<form>
    <OutputVisibilitySection bind:visibilityMode />

    <RollModePicker
        selected={rollMode}
        source={rollModeString}
        onUpdateSelection={(detail) => (rollMode = detail)}
    />

    <RadioGroup
        heading="A5E.abilities.headings.score"
        options={Object.entries(abilities)}
        selected={abilityKey}
        allowDeselect={false}
        onUpdateSelection={(detail) => (abilityKey = detail)}
    />

    <ExpertiseDiePicker
        source={expertiseDieSource}
        selected={expertiseDie}
        type={actor.type}
        onUpdateSelection={(detail) => (expertiseDie = detail)}
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
            class="a5e-button"
            onclick={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {buttonText}
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
