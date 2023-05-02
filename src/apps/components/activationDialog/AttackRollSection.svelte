<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import constructD20RollFormula from "../../../dice/constructD20RollFormula";
    import getAttackAbility from "../../../utils/getAttackAbility";
    import getExpertiseDieSize from "../../../utils/getExpertiseDieSize";
    import {
        overrideRollMode,
        overrideExpertiseDie,
    } from "../../../utils/overrideRollOptions";

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

    const { abilities } = CONFIG.A5E;
    const attackAbility = getAttackAbility($actor, $item, attackRoll);

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ]
    );

    let expertiseDie = overrideExpertiseDie($actor, 0);
    let rollMode = overrideRollMode(
        $actor,
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
        {
            attackType: attackRoll.attackType,
            type: "attack",
        }
    );
    let situationalMods = "";

    $: rollFormula = constructD20RollFormula({
        actor: $actor,
        rollMode,
        modifiers: [
            {
                label: localize("A5E.ProficiencyBonusAbbr"),
                value:
                    (attackRoll?.proficient ?? true) &&
                    $actor.system.attributes.prof,
            },
            {
                label: localize("A5E.AbilityCheckMod", {
                    ability: localize(
                        abilities[attackAbility] ?? attackAbility
                    ),
                }),
                value: $actor.system.abilities[attackAbility ?? ""]?.mod,
            },
            {
                label: localize("A5E.AttackBonus"),
                value: attackRoll?.bonus ?? 0,
            },
            {
                label: localize("A5E.ExpertiseDie"),
                value: getExpertiseDieSize(expertiseDie),
            },
            {
                label: localize("A5E.BonusMeleeWeaponAttack"),
                value:
                    attackRoll?.attackType === "meleeWeaponAttack" &&
                    $actor.system.bonuses.meleeWeaponAttack,
            },
            {
                label: localize("A5E.BonusRangedWeaponAttack"),
                value:
                    attackRoll?.attackType === "rangedWeaponAttack" &&
                    $actor.system.bonuses.rangedWeaponAttack,
            },
            {
                label: localize("A5E.BonusMeleeSpellAttack"),
                value:
                    attackRoll?.attackType === "meleeSpellAttack" &&
                    $actor.system.bonuses.meleeSpellAttack,
            },
            {
                label: localize("A5E.BonusRangedSpellAttack"),
                value:
                    attackRoll?.attackType === "rangedSpellAttack" &&
                    $actor.system.bonuses.rangedSpellAttack,
            },
            {
                value: situationalMods,
            },
        ],
    }).rollFormula;
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
