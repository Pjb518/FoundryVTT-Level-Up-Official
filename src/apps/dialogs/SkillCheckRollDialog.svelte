<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import getRollFormula from "../../utils/getRollFormula";
    import RollModePicker from "../components/RollModePicker.svelte";

    export let document;
    export let dialog;
    export let skillKey;
    export let options;

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return $actor.RollOverrideManager.getExpertiseDice(
            `system.skills.${skillKey}` ?? "",
            $actor.system.skills[skillKey].expertiseDice ||
                options.expertiseDice ||
                0,
            { ability: abilityKey },
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
        {
            abilityKey,
            abilityType: "check",
        },
    );

    $: selectedSkillBonuses = $actor.BonusesManager.getDefaultSelections(
        "skills",
        {
            skillKey,
            abilityKey,
        },
    );

    $: expertiseDie = getInitialExpertiseDieSelection();

    $: expertiseDieSource = $actor.RollOverrideManager.getExpertiseDiceSource(
        `system.skills.${skillKey}`,
        options.expertiseDice ?? 0,
        { ability: abilityKey },
    );

    $: rollMode = $actor.RollOverrideManager.getRollOverride(
        `system.skills.${skillKey}`,
        selectedRollMode,
        { ability: abilityKey },
    );

    $: rollModeString = $actor.RollOverrideManager?.getRollOverridesSource(
        `system.skills.${skillKey}`,
        selectedRollMode,
        { ability: abilityKey },
    );

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

    <RollModePicker
        selected={rollMode}
        source={rollModeString}
        on:updateSelection={({ detail }) => (rollMode = detail)}
    />

    <RadioGroup
        heading="A5E.abilities.headings.score"
        options={Object.entries(abilities)}
        selected={abilityKey}
        allowDeselect={false}
        on:updateSelection={({ detail }) => (abilityKey = detail)}
    />

    <ExpertiseDiePicker
        source={expertiseDieSource}
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
        font-size: var(--a5e-text-size-sm);
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
