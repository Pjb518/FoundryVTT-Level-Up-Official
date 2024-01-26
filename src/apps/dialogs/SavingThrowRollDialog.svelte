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
            $actor.system.abilities[abilityKey]?.save.expertiseDice
        );
    }

    function getSubmitButtonText(saveType, abilityKey) {
        if (saveType === "death") return "Roll Death Saving Throw";
        else if (abilityKey === "con" && saveType === "concentration") {
            return localize("A5E.RollConcentrationCheck");
        } else {
            if (options.dc)
                return localize("A5E.RollPromptSavingThrowWithDC", {
                    ability: localizeSave,
                    dc: options.dc,
                });
            else
                return localize("A5E.RollPromptSavingThrow", {
                    ability: localizeSave,
                });
        }
    }

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    const saveTypes = [
        ["standard", "A5E.SavingThrowNormal"],
        ["concentration", "A5E.ConcentrationCheck"],
    ];

    const actor = new TJSDocument(document);
    const abilityBonuses = $actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "save",
    );
    const appId = dialog.id;
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");
    const localizeSave = localize(CONFIG.A5E.abilities[abilityKey]);

    function onSubmit() {
        dialog.submit({
            expertiseDie,
            rollFormula,
            rollMode,
            saveType,
            visibilityMode,
        });
    }

    let visibilityMode =
        options.visibilityMode ?? game.settings.get("core", "rollMode");

    let expertiseDie = getInitialExpertiseDieSelection();
    let saveType = options.saveType ?? "standard";
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";
    $: selectedAbilityBonuses = $actor.BonusesManager.getDefaultSelections(
        "abilities",
        { abilityKey, ablType: "save" },
    );

    $: rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        type: "save",
        concentration: saveType === "concentration",
        deathSave: !abilityKey,
    });

    $: buttonText = getSubmitButtonText(saveType, abilityKey);

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        saveType,
        situationalMods,
        selectedAbilityBonuses,
        type: "savingThrow",
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

    {#if abilityKey === "con" && saveType !== "death"}
        <RadioGroup
            heading="A5E.ItemSavingThrowType"
            options={saveTypes}
            selected={saveType}
            on:updateSelection={(event) => (saveType = event.detail)}
        />
    {/if}

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
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
