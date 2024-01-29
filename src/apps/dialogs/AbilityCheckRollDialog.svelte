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

    export let { document, abilityKey, dialog, options } =
        getContext("#external").application;

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return (
            options.expertiseDice ??
            $actor.system.abilities[abilityKey]?.check.expertiseDice
        );
    }

    function onSubmit() {
        dialog.submit({ expertiseDie, rollFormula, rollMode, visibilityMode });
    }

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    const actor = new TJSDocument(document);
    const appId = dialog.id;
    const abilityBonuses = $actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "check",
    );
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

    const localizedAbility = localize(CONFIG.A5E.abilities[abilityKey]);
    const buttonText = localize("A5E.RollPromptAbilityCheck", {
        ability: localizedAbility,
    });

    let expertiseDie = getInitialExpertiseDieSelection();
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;

    let rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        type: "check",
    });

    let visibilityMode =
        options.visibilityMode ?? game.settings.get("core", "rollMode");

    let rollFormula;
    let situationalMods = options.situationalMods ?? "";

    $: selectedAbilityBonuses = $actor.BonusesManager.getDefaultSelections(
        "abilities",
        { abilityKey, abilityType: "check" },
    );

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        situationalMods,
        selectedAbilityBonuses,
        type: "abilityCheck",
    });
</script>

<form>
    <OutputVisibilitySection bind:visibilityMode />

    <RadioGroup
        heading="A5E.RollModeHeading"
        options={rollModeOptions}
        selected={rollMode}
        on:updateSelection={({ detail }) => (rollMode = detail)}
    />

    <ExpertiseDiePicker
        selected={expertiseDie}
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

    <FieldWrapper heading="A5E.SituationalMods">
        <input
            class="a5e-input"
            type="text"
            id="{$actor.id}-{appId}-situational-mod"
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
