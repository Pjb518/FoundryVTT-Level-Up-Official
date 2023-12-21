<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import getRollFormula from "../../utils/getRollFormula";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import prepareAbilityBonuses from "../dataPreparationHelpers/prepareAbilityBonuses";
    import prepareSkillBonuses from "../dataPreparationHelpers/prepareSkillBonuses";

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

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    const actor = new TJSDocument(document.actor);
    const appId = dialog.id;
    const abilities = CONFIG.A5E.abilities;
    const skills = { none: "None", ...CONFIG.A5E.skills };

    if (game.settings.get("a5e", "hideA5eSkills")) {
        delete skills.cul;
        delete skills.eng;
    }

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let expertiseDie =
        options.expertiseDice ??
        $actor.system.attributes.initiative.expertiseDice;

    let abilityKey =
        options.abilityKey ??
        $actor.system.attributes.initiative.ability ??
        "dex";

    let rollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let skillKey = options.skillKey ?? "none";
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";

    $: abilityBonuses = prepareAbilityBonuses($actor, abilityKey, "check");
    $: skillBonuses = prepareSkillBonuses($actor, skillKey, "check");
    $: selectedAbilityBonuses = getDefaultSelections({ abilityBonuses });
    $: selectedSkillBonuses = getDefaultSelections({ skillBonuses });

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        situationalMods,
        skill: skillKey,
        selectedAbilityBonuses,
        selectedAbilityBonuses,
        type: "initiative",
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

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <h3 class="heading">
            {localize("A5E.AbilityScore")}
        </h3>

        <RadioGroup
            options={Object.entries(abilities)}
            selected={abilityKey}
            on:updateSelection={({ detail }) => (abilityKey = detail)}
        />
    </section>

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <h3 class="heading">
            {localize("A5E.Skill")}
        </h3>

        <RadioGroup
            options={Object.entries(skills)}
            selected={skillKey}
            on:updateSelection={({ detail }) => (skillKey = detail)}
        />
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
        font-size: $font-size-sm;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
