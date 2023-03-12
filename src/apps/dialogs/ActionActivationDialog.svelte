<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import constructD20RollFormula from "../../dice/constructD20RollFormula";
    import computeSaveDC from "../utils/computeSaveDC";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";
    import validateTemplateData from "../../utils/measuredTemplates/validateTemplateData";

    import prepareExpertiseDiceOptions from "../dataPreparationHelpers/prepareExpertiseDiceOptions";
    import preparePrompts from "../dataPreparationHelpers/itemActivationPrompts/preparePrompts";
    import prepareRolls from "../dataPreparationHelpers/itemActivationRolls/prepareRolls";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    function getDefaultSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (
                    ["generic", "healing", "damage"].includes(value.type) &&
                    !value.formula
                ) {
                    return acc;
                }

                if (value.default ?? true) acc.push(key);
                return acc;
            }, []);
    }

    function getInvalidSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (
                    ["generic", "healing", "damage"].includes(value.type) &&
                    !value.formula
                ) {
                    acc.push(key);
                }

                return acc;
            }, []);
    }

    function onSubmit() {
        // TODO: Clean this up. A lot of stuff here is prototyping for the chat cards
        dialog.submit({
            attack: {
                ...attackRoll,
                rollMode,
                formula: rollFormula,
            },
            prompts: Object.entries(action.prompts ?? {}).reduce(
                (acc, [key, prompt]) => {
                    if (selectedPrompts.includes(key)) {
                        if (prompt.type === "savingThrow") {
                            prompt.dc = computeSaveDC($actor, prompt.saveDC);
                        }

                        acc.push(prompt);
                    }

                    return acc;
                },
                []
            ),
            rolls: Object.entries(action.rolls ?? {}).reduce(
                (acc, [key, roll]) => {
                    // Attack rolls are excluded here because they are formatted differently
                    // and require additional processing.
                    if (selectedRolls.includes(key) && roll.type !== "attack") {
                        acc.push(roll);
                    }

                    return acc;
                },
                []
            ),
            placeTemplate,
        });
    }

    const rollHeadingMap = {
        abilityCheck: "Ability Checks",
        damage: "Damage Rolls",
        generic: "Generic Rolls",
        healing: "Healing Rolls",
        savingThrow: "Saving Throws",
        skillCheck: "Skill Checks",
        toolCheck: "Tool Checks",
    };

    const promptHeadingMap = {
        abilityCheck: "Ability Check Prompts",
        savingThrow: "Saving Throw Prompts",
        skillCheck: "Skill Check Prompts",
        generic: "Generic Roll Prompts",
    };

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ]
    );

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);
    const action = $item.actions[actionId];

    const prompts = preparePrompts(action.prompts);
    const rolls = prepareRolls(action.rolls);

    const attackRoll = rolls?.attack?.length ? rolls.attack[0][1] : {};

    const otherRolls = Object.entries(rolls).reduce(
        (acc, [rollType, rolls]) => {
            if (rollType === "attack") return acc;
            acc[rollType] = rolls;

            return acc;
        },
        {}
    );

    let disabledRolls = getInvalidSelections(rolls);
    let disabledPrompts = getInvalidSelections(prompts);
    let expertiseDie = 0;
    let placeTemplate = action?.area?.placeTemplate ?? false;
    let rollMode = CONFIG.A5E.ROLL_MODE.NORMAL;
    let selectedRolls = getDefaultSelections(rolls);
    let selectedPrompts = getDefaultSelections(prompts);
    let situationalMods = "";

    $: rollFormula = constructD20RollFormula({
        actor: $actor,
        rollMode,
        modifiers: [
            {
                label: localize("A5E.ProficiencyBonusAbbr"),
                value: attackRoll?.proficient && $actor.system.attributes.prof,
            },
            {
                label: localize("A5E.AttackBonus"),
                value: attackRoll?.bonus ?? 0,
            },
            {
                label: localize("A5E.AbilityCheckMod", {
                    ability: attackRoll?.ability,
                }),
                value: $actor.system.abilities[attackRoll?.ability ?? ""]?.mod,
            },
            {
                label: localize("A5E.ExpertiseDie"),
                value: getExpertiseDieSize(expertiseDie),
            },
            {
                label: localize("A5E.BonusMeleeWeaponAttack"),
                value:
                    attackRoll?.attackType === "meleeWeaponAttack" &&
                    $actor.system.bonuses.mwak,
            },
            {
                label: localize("A5E.BonusRangedWeaponAttack"),
                value:
                    attackRoll?.attackType === "rangedWeaponAttack" &&
                    $actor.system.bonuses.rwak,
            },
            {
                label: localize("A5E.BonusMeleeSpellAttack"),
                value:
                    attackRoll?.attackType === "meleeSpellAttack" &&
                    $actor.system.bonuses.msak,
            },
            {
                label: localize("A5E.BonusRangedSpellAttack"),
                value:
                    attackRoll?.attackType === "rangedSpellAttack" &&
                    $actor.system.bonuses.rsak,
            },
            {
                value: situationalMods,
            },
        ],
    }).rollFormula;
</script>

<form>
    <!-- TODO: Extract this to its own component -->
    {#if !foundry.utils.isEmpty(attackRoll)}
        <section class="a5e-box u-flex u-flex-col u-gap-lg u-p-md">
            <section>
                <h3 class="heading">
                    {localize("A5E.AttackRollModeHeading")}
                </h3>

                <RadioGroup
                    options={rollModeOptions}
                    selected={rollMode}
                    on:updateSelection={({ detail }) => (rollMode = detail)}
                />
            </section>

            <section>
                <h3 class="heading">
                    {localize("A5E.ExpertiseDie")}
                </h3>

                <RadioGroup
                    options={prepareExpertiseDiceOptions()}
                    selected={expertiseDie}
                    optionStyles="min-width:2rem; text-align: center;"
                    on:updateSelection={({ detail }) => (expertiseDie = detail)}
                />
            </section>

            <section>
                <label
                    class="heading"
                    for="{$actor.id}-{dialog.id}-situational-mods"
                >
                    {localize("A5E.SituationalMods")}
                </label>

                <div class="u-flex u-flex-col u-gap-sm">
                    <input
                        class="a5e-input"
                        type="text"
                        id="{$actor.id}-{dialog.id}-situational-mod"
                        bind:value={situationalMods}
                    />

                    <div class="roll-formula-preview">
                        {rollFormula}
                    </div>
                </div>
            </section>
        </section>
    {/if}

    {#if validateTemplateData($item, actionId)}
        <FormSection>
            <div class="u-align-center u-flex u-gap-md">
                <input
                    class="u-pointer"
                    type="checkbox"
                    id="{dialog.id}-place-template"
                    bind:checked={placeTemplate}
                />

                <label class="u-pointer" for="{dialog.id}-place-template">
                    {localize("A5E.ItemPlaceTemplate")}
                </label>
            </div>
        </FormSection>
    {/if}

    <!-- If there are no rolls, hide this section -->
    {#if Object.values(rolls).flat().length}
        <FormSection hint="A5E.RollsHint">
            <div class="roll-wrapper">
                {#each Object.entries(otherRolls) as [rollType, _rolls]}
                    {#if _rolls.length}
                        <section>
                            <h3 class="section-subheading">
                                {rollHeadingMap[rollType]}
                            </h3>

                            <CheckboxGroup
                                options={_rolls.map(([key, roll]) => [
                                    key,
                                    roll.label ?? roll.defaultLabel,
                                ])}
                                disabledOptions={disabledRolls}
                                selected={selectedRolls}
                                on:updateSelection={(event) =>
                                    (selectedRolls = event.detail)}
                            />
                        </section>
                    {/if}
                {/each}
            </div>
        </FormSection>
    {/if}

    <!-- If there are no prompts, hide this section -->
    {#if Object.values(prompts).flat().length}
        <FormSection hint="A5E.PromptsHint">
            <div class="prompt-wrapper">
                {#each Object.entries(prompts) as [promptType, _prompts]}
                    {#if _prompts.length}
                        <section>
                            <h3 class="section-subheading">
                                {promptHeadingMap[promptType]}
                            </h3>

                            <CheckboxGroup
                                options={_prompts.map(([key, prompt]) => [
                                    key,
                                    prompt.label,
                                ])}
                                disabledOptions={disabledPrompts}
                                selected={selectedPrompts}
                                on:updateSelection={(event) =>
                                    (selectedPrompts = event.detail)}
                            />
                        </section>
                    {/if}
                {/each}
            </div>
        </FormSection>
    {/if}

    <section>
        <button on:click|preventDefault={onSubmit}>
            <i class="fa-solid fa-dice" />
            {localize("A5E.DialogSubmitRoll")}
        </button>
    </section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        max-height: 50rem;
        overflow-y: auto;
    }

    :global(small) {
        margin-top: 0.25rem;
    }

    .heading {
        display: block;
        font-weight: bold;
        font-size: 0.833rem;
        margin-bottom: 0.25rem;
    }

    .roll-wrapper,
    .prompt-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }

    .section-subheading {
        width: 100%;
        font-size: 0.833rem;
        font-weight: bold;
        margin-bottom: 0.25rem;
    }
</style>
