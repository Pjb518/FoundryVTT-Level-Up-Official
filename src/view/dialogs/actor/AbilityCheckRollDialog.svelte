<script lang="ts">
    import type { AbilityCheckRollOptions } from "../../../documents/actor/data.ts";

    import { localize } from "#utils/localization/localize.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import OutputVisibilitySection from "#view/components/OutputVisibilitySection.svelte";
    import RollModePicker from "#view/components/RollModePicker.svelte";

    import getRollFormula from "#utils/getRollFormula.js";

    type Props = {
        document: any;
        abilityKey: string;
        dialog: any;
        options: AbilityCheckRollOptions;
    };

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return actor.RollOverrideManager.getExpertiseDice(
            `system.abilities.${abilityKey}.check`,
            actor.system.abilities[abilityKey].check.expertiseDice ||
                options.expertiseDice ||
                0,
        );
    }

    function onSubmit() {
        dialog.submit({ expertiseDie, rollFormula, rollMode, visibilityMode });
    }

    let { document, abilityKey, dialog, options }: Props = $props();

    let actor = document;
    const appId = dialog.id;

    const abilityBonuses = actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "check",
    );

    const hideExpertiseDice = game.settings.get(
        "a5e",
        "hideExpertiseDice",
    ) as boolean;

    const localizedAbility = localize(CONFIG.A5E.abilities[abilityKey]);
    const buttonText = localize("A5E.RollPromptAbilityCheck", {
        ability: localizedAbility,
    });

    let expertiseDie = $state(getInitialExpertiseDieSelection());
    let selectedRollMode = $state(
        options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL,
    );

    let expertiseDieSource = actor.RollOverrideManager.getExpertiseDiceSource(
        `system.abilities.${abilityKey}.check`,
        options.expertiseDice ?? 0,
    );

    let rollMode = $state(
        actor.RollOverrideManager.getRollOverride(
            `system.abilities.${abilityKey}.check`,
            selectedRollMode,
        ),
    );

    let rollModeString = actor.RollOverrideManager?.getRollOverridesSource(
        `system.abilities.${abilityKey}.check`,
        selectedRollMode,
    );

    let visibilityMode = $state(
        options.visibilityMode ?? game.settings.get("core", "rollMode"),
    );

    let situationalMods = $state(options.situationalMods ?? "");

    let selectedAbilityBonuses = $state(
        actor.BonusesManager.getDefaultSelections("abilities", {
            abilityKey,
            abilityType: "check",
        }),
    );

    let rollFormula = $derived(
        getRollFormula(actor.reactive, {
            ability: abilityKey,
            expertiseDie,
            rollMode,
            situationalMods,
            selectedAbilityBonuses,
            type: "abilityCheck",
        }),
    );
</script>

<form>
    <OutputVisibilitySection bind:visibilityMode />

    <RollModePicker
        selected={rollMode}
        source={rollModeString}
        onUpdateSelection={(value) => (rollMode = value)}
    />

    <ExpertiseDiePicker
        source={expertiseDieSource}
        selected={expertiseDie}
        type={actor.type}
        onUpdateSelection={(value) => (expertiseDie = value)}
    />

    {#if Object.values(abilityBonuses).flat().length}
        <CheckboxGroup
            heading="Ability Bonuses"
            options={abilityBonuses.map(([key, abilityBonus]) => [
                key,
                abilityBonus.label || abilityBonus.defaultLabel,
            ])}
            selected={selectedAbilityBonuses}
            onUpdateSelection={(value) => (selectedAbilityBonuses = value)}
        />
    {/if}

    <FieldWrapper heading="A5E.SituationalMods">
        <input
            class="a5e-input a5e-input-slim"
            type="text"
            id="{actor.id}-{appId}-situational-mod"
            bind:value={situationalMods}
        />
    </FieldWrapper>

    <section class="roll-formula-preview">
        {rollFormula}
    </section>

    <section>
        <button
            class="a5e-button"
            type="submit"
            onclick={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {buttonText}
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

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: var(--a5e-sm-text);
        border: 1px solid var(--a5e-border-color);
        border-radius: 4px;
    }
</style>
