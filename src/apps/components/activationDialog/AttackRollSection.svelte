<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import getAttackAbility from "../../../utils/getAttackAbility";
    import getRollFormula from "../../../utils/getRollFormula";
    import overrideRollMode from "../../../utils/overrideRollMode";
    import overrideExpertiseDie from "../../../utils/overrideExpertiseDie";

    import ExpertiseDiePicker from "../ExpertiseDiePicker.svelte";
    import FormSection from "../FormSection.svelte";
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
            expertiseDie,
            rollMode,
            formula: rollFormula,
        };
    }

    const attackAbility = getAttackAbility($actor, $item, attackRoll);

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => [
            CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
            localize(value),
        ],
    );

    let expertiseDie = overrideExpertiseDie($actor, 0);
    let situationalMods = "";

    let rollMode = overrideRollMode(
        $actor,
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
        {
            attackType: attackRoll.attackType,
            type: "attack",
        },
    );

    $: rollFormula = getRollFormula($actor, {
        ability: attackAbility,
        attackBonus: attackRoll?.bonus,
        attackType: attackRoll?.attackType,
        expertiseDie,
        proficient: attackRoll?.proficient ?? true,
        situationalMods,
        rollMode,
        type: "attack",
    });

    $: rollFormula, updateData();

    updateData();
</script>

<FormSection --direction="column" --gap="0.75rem">
    <FormSection
        heading="A5E.AttackRollModeHeading"
        --background="transparent"
        --gap="0.25rem"
        --padding="0"
    >
        <RadioGroup
            options={rollModeOptions}
            selected={rollMode}
            on:updateSelection={({ detail }) => (rollMode = detail)}
        />
    </FormSection>

    <ExpertiseDiePicker
        --background="transparent"
        --gap="0.25rem"
        --padding="0"
        selected={expertiseDie}
        on:updateSelection={({ detail }) => (expertiseDie = detail)}
    />

    <FormSection
        heading="A5E.SituationalMods"
        --background="transparent"
        --gap="0.25rem"
        --padding="0"
    >
        <input
            class="a5e-input"
            type="text"
            id="{$actor.id}-{dialog.id}-situational-mod"
            bind:value={situationalMods}
        />
    </FormSection>
</FormSection>

<section class="roll-formula-preview">
    {rollFormula}
</section>

<style lang="scss">
    .roll-formula-preview {
        padding: 0.5rem;
        font-size: $font-size-sm;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
