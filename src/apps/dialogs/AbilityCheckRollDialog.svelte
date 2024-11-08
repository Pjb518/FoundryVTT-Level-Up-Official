<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import OutputVisibilitySection from "../components/activationDialog/OutputVisibilitySection.svelte";

    import getRollFormula from "../../utils/getRollFormula";
    import RollModePicker from "../components/RollModePicker.svelte";

    export let { document, abilityKey, dialog, options } =
        getContext("#external").application;

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return $actor.RollOverrideManager.getExpertiseDice(
            `system.abilities.${abilityKey}.check`,
            $actor.system.abilities[abilityKey].check.expertiseDice ||
                options.expertiseDice ||
                0,
        );
    }

    function onSubmit() {
        dialog.submit({ expertiseDie, rollFormula, rollMode, visibilityMode });
    }

    const actor = new TJSDocument(document);
    const appId = dialog.id;
    const abilityBonuses = $actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "check",
    );
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

    const localizedAbility = localize(CONFIG.A5E.abilities[abilityKey]);
    const buttonText = localize("A5E.RollPromptAbilityCheck", {
        ability: localizedAbility,
    });

    let expertiseDie = getInitialExpertiseDieSelection();
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;

    let expertiseDieSource = $actor.RollOverrideManager.getExpertiseDiceSource(
        `system.abilities.${abilityKey}.check`,
        options.expertiseDie ?? 0,
    );

    let rollMode = $actor.RollOverrideManager.getRollOverride(
        `system.abilities.${abilityKey}.check`,
        selectedRollMode,
    );

    let rollModeString = $actor.RollOverrideManager?.getRollOverridesSource(
        `system.abilities.${abilityKey}.check`,
        selectedRollMode,
    );

    let visibilityMode = options.visibilityMode ?? game.settings.get("core", "rollMode");

    let { minRoll } = options.minRoll ?? $actor.system.abilities[abilityKey].check;
    let rollFormula;
    let situationalMods = options.situationalMods ?? "";

    $: selectedAbilityBonuses = $actor.BonusesManager.getDefaultSelections("abilities", {
        abilityKey,
        abilityType: "check",
    });

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
	minRoll,
        rollMode,
        situationalMods,
        selectedAbilityBonuses,
        type: "abilityCheck",
    });
</script>

<form>
    <OutputVisibilitySection bind:visibilityMode />

    <RollModePicker
        selected={rollMode}
        source={rollModeString}
        on:updateSelection={({ detail }) => (rollMode = detail)}
    />

    <ExpertiseDiePicker
        source={expertiseDieSource}
        selected={expertiseDie}
        type={$actor.type}
        on:updateSelection={({ detail }) => (expertiseDie = detail)}
    />

    {#if Object.values(abilityBonuses).flat().length}
        <CheckboxGroup
            heading="Ability Bonuses"
            options={abilityBonuses.map(([key, abilityBonus]) => [
                key,
                abilityBonus.label || abilityBonus.defaultLabel,
            ])}
            selected={selectedAbilityBonuses}
            on:updateSelection={({ detail }) => (selectedAbilityBonuses = detail)}
        />
    {/if}

    <FieldWrapper heading="A5E.SituationalMods">
        <input
            class="a5e-input"
            type="text"
            id="{$actor.id}-{appId}-situational-mod"
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
        font-size: var(--a5e-text-size-sm);
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
