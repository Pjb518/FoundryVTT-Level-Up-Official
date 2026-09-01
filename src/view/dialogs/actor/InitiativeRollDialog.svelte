<script lang="ts">
    import { RollOverrideManager } from "#managers/RollOverrideManagerN.ts";

    import getRollFormula from "#utils/getRollFormula.js";
    import RollModePicker from "#view/components/RollModePicker.svelte";
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import type { InitiativeRollOptions } from "../../../documents/actor/data.ts";

    type Props = {
        document: any;
        dialog: any;
        options: InitiativeRollOptions;
    };

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice)
            return { expertiseDie: 0, expertiseDieSource: "" };

        const others = [] as any[];
        if (ability) others.push({ type: "ability", src: ability.check });
        if (skill) others.push({ type: "skill", src: skill });
        const edData = RollOverrideManager.resolveExpertiseDie(initiativeSrc, {
            others,
        });

        return {
            expertiseDie: edData.value,
            expertiseDieSource: edData.source,
        };
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

    const initialAbilityKey =
        options.abilityKey ??
        actor.system.attributes.initiative.ability ??
        "dex";
    const initialSkillKey = options.skillKey ?? "none";

    let abilityKey = $state(initialAbilityKey);
    let skillKey = $state(initialSkillKey);
    let situationalMods = $state(options.situationalMods ?? "");
    let initialRollMode = $state(
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    );

    let ability = $derived(actor.reactive.system.abilities[abilityKey]);
    let skill = $derived(actor.reactive.system.skills[skillKey]);
    let initiativeSrc = actor.reactive.system.attributes.initiative;

    let { expertiseDie, expertiseDieSource } = $derived(
        getInitialExpertiseDieSelection(),
    );

    let rollModeData = $derived(
        RollOverrideManager.resolveRollMode(initiativeSrc, initialRollMode, {
            others: [
                { type: "ability", src: ability.check },
                { type: "skill", src: skill },
            ],
        }),
    );

    let rollMode = $derived(rollModeData.value);
    let rollModeString = $derived(rollModeData.source);

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
        onUpdateSelection={(detail) =>
            (initialRollMode = Number.parseInt(detail, 10))}
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
        onUpdateSelection={(value) =>
            (expertiseDie = Number.parseInt(value, 10))}
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
            type="button"
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
