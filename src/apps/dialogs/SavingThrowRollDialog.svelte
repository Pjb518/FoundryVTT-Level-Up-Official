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

    export let { actorDocument, abilityKey, dialog, options } =
        getContext("#external").application;

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
        ]
    );

    const saveTypes = [
        ["standard", "A5E.SavingThrowNormal"],
        ["concentration", "A5E.ConcentrationCheck"],
    ];

    const actor = new TJSDocument(actorDocument);
    const appId = dialog.id;
    const localizeSave = localize(CONFIG.A5E.abilities[abilityKey]);

    function onSubmit() {
        dialog.submit({ rollFormula, visibilityMode });
    }

    let expertiseDie =
        options.expertiseDice ??
        $actor.system.abilities[abilityKey]?.save.expertiseDice;

    let saveType = options.saveType ?? "standard";
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";
    let visibilityMode = game.settings.get("core", "rollMode");

    $: rollMode = overrideRollMode($actor, selectedRollMode, {
        ability: abilityKey,
        type: "save",
        concentration: saveType === "concentration",
        deathSave: !!!abilityKey,
    });

    $: buttonText = getSubmitButtonText(saveType, abilityKey);

    $: rollFormula = constructD20RollFormula({
        actor: $actor,
        rollMode,
        modifiers: [
            {
                label: localize("A5E.AbilityCheckMod", {
                    ability: localizeSave,
                }),
                value: $actor.system.abilities[abilityKey]?.save.mod,
            },
            {
                label: localize("A5E.SavingThrowBonus", {
                    ability: localizeSave,
                }),
                value: $actor.system.abilities[abilityKey]?.save.bonus,
            },
            {
                label: localize("A5E.ConcentrationBonus"),
                value:
                    saveType === "concentration"
                        ? $actor.system.abilities[abilityKey]?.save
                              .concentrationBonus
                        : null,
            },
            {
                label: localize("A5E.SavingThrowBonusGlobal"),
                value: $actor.system.bonuses.abilities.save,
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

    <FormSection heading="A5E.ExpertiseDie">
        <ExpertiseDiePicker
            selected={expertiseDie}
            on:updateSelection={({ detail }) => (expertiseDie = detail)}
        />
    </FormSection>

    {#if abilityKey === "con" && saveType !== "death"}
        <FormSection heading="A5E.ItemSavingThrowType">
            <RadioGroup
                options={saveTypes}
                selected={saveType}
                on:updateSelection={(event) => (saveType = event.detail)}
            />
        </FormSection>
    {/if}

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
