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

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let abilityKey =
        options.abilityKey ??
        $actor.system.attributes.initiative.ability ??
        "dex";

    let expertiseDie = getInitialExpertiseDieSelection();
    let rollFormula;
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let situationalMods = options.situationalMods ?? "";

    let rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        type: "initiative",
    });

    $: abilityBonuses = prepareAbilityBonuses($actor, abilityKey, "check");
    $: selectedAbilityBonuses = getDefaultSelections({ abilityBonuses });

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        situationalMods,
        selectedAbilityBonuses,
        type: "initiative",
    });
</script>

<form>
    <RadioGroup
        heading="A5E.RollModeHeading"
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

    <ExpertiseDiePicker
        selected={expertiseDie}
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

    <FieldWrapper heading="A5E.SituationalMods">
        <input class="a5e-input" type="text" bind:value={situationalMods} />
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
