<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import constructD20RollFormula from "../../dice/constructD20RollFormula";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";
    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";

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
            game.i18n.localize(value),
        ]
    );

    const saveTypes = [
        { name: "A5E.SavingThrowNormal", value: "standard" },
        { name: "A5E.ConcentrationCheck", value: "concentration" },
    ];

    const actor = new TJSDocument(actorDocument);
    const appId = dialog.id;
    const localizeSave = localize(CONFIG.A5E.abilities[abilityKey]);

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let expertiseDie =
        options.expertiseDice ??
        $actor.system.abilities[abilityKey]?.save.expertiseDice;

    let saveType = options.saveType ?? "standard";
    let rollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";

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
    });
</script>

<form>
    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <h3 class="heading">
            {localize("A5E.RollModeHeading")}
        </h3>

        <RadioGroup
            options={rollModeOptions}
            selected={rollMode}
            on:updateSelection={({ detail }) => (rollMode = detail)}
        />
    </section>

    <FormSection heading="A5E.ExpertiseDie">
        <RadioGroup
            options={prepareExpertiseDiceOptions()}
            selected={expertiseDie}
            optionStyles="min-width:2rem; text-align: center;"
            on:updateSelection={({ detail }) => (expertiseDie = detail)}
        />
    </FormSection>

    {#if abilityKey === "con" && saveType !== "death"}
        <section
            class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative"
        >
            <h3 class="heading">
                {localize("A5E.ItemSavingThrowType")}
            </h3>

            <div
                class="
                u-flex
                u-flex-wrap
                u-list-style-none
                u-m-0
                u-p-0
                u-w-full
                u-gap-md
                u-text-sm
            "
                role="radiogroup"
                id={`${$actor.id}-${appId}-save-type`}
            >
                {#each saveTypes as { name, value }}
                    <input
                        class="u-hidden"
                        type="radio"
                        id="{$actor.id}-{appId}-save-type-{value}"
                        bind:group={saveType}
                        {value}
                    />
                    <label
                        class="a5e-tag u-pointer u-p-md u-text-center"
                        class:a5e-tag--active={value === saveType}
                        for="{$actor.id}-{appId}-save-type-{value}"
                    >
                        {localize(name)}
                    </label>
                {/each}
            </div>
        </section>
    {/if}

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <label class="heading" for="{$actor.id}-{appId}-situational-mods">
            {localize("A5E.SituationalMods")}
        </label>

        <input
            class="a5e-input"
            type="text"
            id="{$actor.id}-{appId}-situational-mods"
            bind:value={situationalMods}
        />
    </section>

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

    .heading {
        display: block;
        font-weight: bold;
        font-size: 0.833rem;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
