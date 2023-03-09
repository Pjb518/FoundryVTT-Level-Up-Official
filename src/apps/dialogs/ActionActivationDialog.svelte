<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import constructD20RollFormula from "../../dice/constructD20RollFormula";
    import computeSaveDC from "../utils/computeSaveDC";
    import getExpertiseDieSize from "../../utils/getExpertiseDieSize";

    import preparePrompts from "../dataPreparationHelpers/itemActivationPrompts/preparePrompts";
    import prepareRolls from "../dataPreparationHelpers/itemActivationRolls/prepareRolls";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";

    export let { actionId, actorDocument, dialog, itemDocument, options } =
        getContext("#external").application;

    function getDefaultSelections(property) {
        return Object.values(property ?? {})
            .flat()
            .reduce((acc, [key, value]) => {
                if (value.default ?? true) acc.push(key);
                return acc;
            }, []);
    }

    function onSubmit() {
        // TODO: Clean this up. A lot of stuff here is prototyping for the chat cards
        dialog.submit({
            prompts: Object.entries(action.prompts ?? {})
                ?.filter(([key]) => selectedPrompts.includes(key))
                .map(([key, prompt]) => {
                    if (prompt.type === "savingThrow") {
                        prompt.dc = computeSaveDC($actor, prompt.saveDC);
                    }

                    return [key, prompt];
                }),
            rolls: Object.entries(action.rolls ?? {})?.filter(([key]) =>
                selectedRolls.includes(key)
            ),
            rollMode,
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
        ([key, value]) => ({
            id: key,
            name: game.i18n.localize(value),
            value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        })
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

    let expertiseDie = 0;
    let rollMode = CONFIG.A5E.ROLL_MODE.NORMAL;
    let selectedRolls = getDefaultSelections(rolls);
    let selectedPrompts = getDefaultSelections(prompts);
    let situationalMods = "";

    $: rollFormula = constructD20RollFormula({
        actor: $actor,
        rollMode,
        modifiers: [
            {
                value: attackRoll?.proficient && $actor.system.attributes.prof,
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
    });
</script>

<form>
    <!-- TODO: Extract this to its own component -->
    {#if attackRoll}
        <section class="a5e-box u-flex u-flex-col u-gap-lg u-p-md">
            <section>
                <h3 class="heading">
                    {localize("A5E.AttackRollModeHeading")}
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
                    id={`${$actor.id}-${dialog.id}-rollMode`}
                >
                    {#each rollModeOptions as { id, name, value }}
                        <input
                            class="u-hidden"
                            type="radio"
                            id="{$actor.id}-{dialog.id}-rollMode-{id}"
                            bind:group={rollMode}
                            {value}
                        />

                        <label
                            class="a5e-tag u-pointer u-p-md u-text-center"
                            class:a5e-tag--active={value === rollMode}
                            for="{$actor.id}-{dialog.id}-rollMode-{id}"
                        >
                            {name}
                        </label>
                    {/each}
                </div>
            </section>

            <section>
                <h3 class="heading">
                    {localize("A5E.ExpertiseDie")}
                </h3>

                <ExpertiseDiePicker
                    selected={expertiseDie}
                    on:updateSelection={(event) => {
                        expertiseDie = event.detail;
                    }}
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
                                    roll.label,
                                ])}
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
