<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import getAttackAbility from "../../../utils/getAttackAbility";
    import getRollFormula from "../../../utils/getRollFormula";
    import overrideRollMode from "../../../utils/overrideRollMode";
    import overrideExpertiseDie from "../../../utils/overrideExpertiseDie";

    import ExpertiseDiePicker from "../ExpertiseDiePicker.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    export let attackRollData;
    export let options;
    export let attackRoll;

    const actor = getContext("actor");
    const dialog = getContext("dialog");
    const item = getContext("item");

    function updateData() {
        attackRollData = {
            ...attackRoll,
            rollMode,
            formula: rollFormula,
        };
    }

    const attackAbility = getAttackAbility($actor, $item, attackRoll);

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ]
    );

    let expertiseDie = overrideExpertiseDie($actor, 0);
    let situationalMods = "";

    let rollMode = overrideRollMode(
        $actor,
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
        {
            attackType: attackRoll.attackType,
            type: "attack",
        }
    );

    $: rollFormula = getRollFormula($actor, {
        ability: attackAbility,
        attackBonus: attackRoll?.bonus,
        attackType: attackRoll?.type,
        expertiseDie,
        proficient: attackRoll?.proficient ?? true,
        situationalMods,
        rollMode,
        type: "attack",
    });

    $: rollFormula, updateData();

    updateData();
</script>

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

        <ExpertiseDiePicker
            selected={expertiseDie}
            on:updateSelection={({ detail }) => (expertiseDie = detail)}
        />
    </section>

    <section>
        <label class="heading" for="{$actor.id}-{dialog.id}-situational-mods">
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

<style lang="scss">
    .heading {
        display: block;
        font-weight: bold;
        font-size: 0.833rem;
        margin-bottom: 0.25rem;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
