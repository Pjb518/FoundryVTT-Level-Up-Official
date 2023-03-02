<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";

    import constructD20RollFormula from "../../modules/dice/constructD20RollFormula";
    import getExpertiseDieSize from "../../modules/utils/getExpertiseDieSize";

    export let { combatant, dialog, options } =
        getContext("#external").application;

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => ({
            id: key,
            name: game.i18n.localize(value),
            value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        })
    );

    const actor = new TJSDocument(combatant.actor);
    const appId = dialog.id;
    const abilities = CONFIG.A5E.abilities;
    const skills = { none: null, ...CONFIG.A5E.skills };

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let expertiseDie =
        options.expertiseDice ??
        $actor.system.attributes.initiative.expertiseDice;

    let rollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let abilityKey = options.abilityKey ?? "dex";
    let skillKey = options.skillKey ?? "none";
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";

    $: rollFormula = constructD20RollFormula({
        actor: $actor,
        rollMode,
        modifiers: [
            {
                label: localize("A5E.InitiativeBonus"),
                value: $actor.system.attributes.initiative.bonus,
            },
            {
                label: localize("A5E.AbilityCheckMod", {
                    ability: localize(CONFIG.A5E.abilities[abilityKey]),
                }),
                value: $actor.system.abilities[abilityKey]?.check.mod,
            },
            {
                label: localize("A5E.SkillCheckMod", {
                    skill: localize(CONFIG.A5E.skills[skillKey]),
                }),
                value: $actor.system.skills[skillKey]?.mod,
            },
            {
                label: localize("A5E.AbilityCheckBonus", {
                    ability: localize(CONFIG.A5E.abilities[abilityKey]),
                }),
                value: $actor.system.abilities[abilityKey]?.check.bonus,
            },
            {
                label: localize("A5E.SkillCheckBonus", {
                    skill: localize(CONFIG.A5E.skills[skillKey]),
                }),
                value: $actor.system.skills[skillKey]?.bonuses.check,
            },
            {
                label: localize("A5E.AbilityCheckBonusGlobal"),
                value: $actor.system.bonuses.abilities.check,
            },
            {
                label: localize("A5E.SkillCheckBonusGlobal"),
                value: skillKey ? $actor.system.bonuses.abilities.skill : null,
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
            id={`${$actor.id}-${appId}-rollMode`}
        >
            {#each rollModeOptions as { id, name, value }}
                <input
                    class="u-hidden"
                    type="radio"
                    id={`${$actor.id}-${appId}-rollMode-${id}`}
                    bind:group={rollMode}
                    {value}
                />
                <label
                    class="a5e-tag u-pointer u-p-md u-text-center"
                    class:a5e-tag--inactive={value !== rollMode}
                    for={`${$actor.id}-${appId}-rollMode-${id}`}
                >
                    {name}
                </label>
            {/each}
        </div>
    </section>

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <h3 class="heading">
            {localize("A5E.AbilityScore")}
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
            id={`${$actor.id}-${appId}-ability-score`}
        >
            {#each Object.entries(abilities) as [key, name]}
                <input
                    class="u-hidden"
                    type="radio"
                    id={`${$actor.id}-${appId}-ability-score-${key}`}
                    bind:group={abilityKey}
                    value={key}
                />
                <label
                    class="a5e-tag u-pointer u-p-md u-text-center"
                    class:a5e-tag--inactive={key !== abilityKey}
                    for={`${$actor.id}-${appId}-ability-score-${key}`}
                >
                    {localize(name ?? "A5E.None")}
                </label>
            {/each}
        </div>
    </section>

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <h3 class="heading">
            {localize("A5E.Skill")}
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
            id={`${$actor.id}-${appId}-skill`}
        >
            {#each Object.entries(skills) as [key, name]}
                <input
                    class="u-hidden"
                    type="radio"
                    id={`${$actor.id}-${appId}-skill-${key}`}
                    bind:group={skillKey}
                    value={key}
                />
                <label
                    class="a5e-tag u-pointer u-text-center"
                    class:a5e-tag--inactive={key !== skillKey}
                    for={`${$actor.id}-${appId}-skill-${key}`}
                >
                    {localize(name ?? "A5E.None")}
                </label>
            {/each}
        </div>
    </section>

    <FormSection heading="A5E.ExpertiseDie">
        <ExpertiseDiePicker
            selected={expertiseDie}
            on:updateSelection={(event) => {
                expertiseDie = event.detail;
            }}
        />
    </FormSection>

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <label class="heading" for={`${$actor.id}-${appId}-situational-mods`}>
            {localize("A5E.SituationalMods")}
        </label>

        <input
            class="a5e-input"
            type="text"
            id={`${$actor.id}-${appId}-situational-mods`}
            bind:value={situationalMods}
        />
    </section>

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
