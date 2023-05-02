<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import constructD20RollFormula from "../../dice/constructD20RollFormula";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";
    import { overrideRollMode } from "../../utils/overrideRollOptions";

    export let { actorDocument, dialog, skillKey, options } =
        getContext("#external").application;

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ]
    );

    const actor = new TJSDocument(actorDocument);
    const appId = dialog.id;

    const localizedSkill = localize(CONFIG.A5E.skills[skillKey]);
    const abilities = { none: "A5E.None", ...CONFIG.A5E.abilities };

    const buttonText = localize("A5E.RollPromptAbilityCheck", {
        ability: localizedSkill,
    });

    function onSubmit() {
        dialog.submit({ rollFormula, abilityKey, visibilityMode });
    }

    let abilityKey =
        options.abilityKey ?? $actor.system.skills[skillKey].ability;

    let expertiseDie =
        options.expertiseDice ?? $actor.system.skills[skillKey].expertiseDice;

    let { minRoll } = options.minRoll ?? $actor.system.skills[skillKey];
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        skill: skillKey,
        type: "skill",
    });
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";
    let visibilityMode = game.settings.get("core", "rollMode");

    $: rollFormula = constructD20RollFormula({
        actor: $actor,
        rollMode,
        minRoll,
        modifiers: [
            {
                label: localize("A5E.SkillCheckMod", { skill: localizedSkill }),
                value: $actor.system.skills[skillKey].mod,
            },
            {
                label: localize("A5E.AbilityCheckMod", {
                    ability: localize(CONFIG.A5E.abilities[abilityKey]),
                }),
                value: $actor.system.abilities[abilityKey]?.check.mod,
            },
            {
                label: localize("A5E.SkillCheckBonus", {
                    skill: localizedSkill,
                }),
                value: $actor.system.skills[skillKey].bonuses.check,
            },
            {
                label: localize("A5E.AbilityCheckBonus", {
                    ability: localize(CONFIG.A5E.abilities[abilityKey]),
                }),
                value: $actor.system.abilities[abilityKey]?.check.bonus,
            },
            {
                label: localize("A5E.SkillCheckBonusGlobal"),
                value: $actor.system.bonuses.abilities.skill,
            },
            {
                label: localize("A5E.AbilityCheckBonusGlobal"),
                value: $actor.system.bonuses.abilities.check,
            },
            {
                label: localize("A5E.ExpertiseDie"),
                value: getExpertiseDieSize(expertiseDie),
            },
            {
                value: situationalMods,
            },
        ],
    }).rollFormula;
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
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
