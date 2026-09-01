<script lang="ts">
    import type { SavingThrowRollOptions } from "../../../documents/actor/data.ts";

    import { localize } from "#utils/localization/localize.ts";

    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "#view/snippets/ExpertiseDiePicker.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import OutputVisibilitySection from "#view/components/OutputVisibilitySection.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import RollModePicker from "#view/components/RollModePicker.svelte";
    import { RollOverrideManager } from "#managers/RollOverrideManagerN.ts";

    import getRollFormula from "#utils/getRollFormula.js";

    type Props = {
        document: Actor.OfType<"base">;
        abilityKey: string;
        dialog: any;
        options: SavingThrowRollOptions;
    };

    function getRollModeKey(saveType: string, abilityKey: string) {
        if (!abilityKey) return "deathSave";
        if (saveType === "concentration") return "concentration";
        return `system.abilities.${abilityKey}.save`;
    }

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return actor.RollOverrideManager.getExpertiseDice(
            rollModeKey ?? "",
            actor.system.abilities[abilityKey]?.save?.expertiseDice ||
                options.expertiseDice ||
                0,
        );
    }

    function getSaveSrc(saveType: string, abilityKey: string) {
        if (!abilityKey) return actor.reactive.system.rolls.death;
        // TODO: Update this to concentration when in place
        if (saveType === "concentration")
            return actor.reactive.system.abilities.con.save;
        return actor.reactive.system.abilities[abilityKey].save;
    }

    function getSubmitButtonText(saveType: string, abilityKey: string) {
        if (saveType === "death") return "Roll Death Saving Throw";

        if (abilityKey === "con" && saveType === "concentration") {
            return localize("A5E.rollLabels.rollConcentrationCheck");
        }

        if (options.dc)
            return localize("A5E.rollLabels.prompts.savingThrowWithDC", {
                ability: localizeSave,
                dc: options.dc,
            });

        return localize("A5E.rollLabels.prompts.savingThrow", {
            ability: localizeSave,
        });
    }

    function onSubmit() {
        dialog.submit({
            expertiseDie,
            rollFormula,
            rollMode,
            saveType,
            visibilityMode,
        });
    }

    let { document, abilityKey, dialog, options }: Props = $props();

    const saveTypes = [
        ["standard", "A5E.rollLabels.savingThrows.normal"],
        ["concentration", "A5E.rollLabels.concentrationCheck"],
    ];

    let actor = document;

    const abilityBonuses = actor.BonusesManager.prepareAbilityBonuses(
        abilityKey,
        "save",
    );

    const appId = dialog.id;
    const hideExpertiseDice = game.settings.get(
        "a5e",
        "hideExpertiseDice",
    ) as boolean;
    const localizeSave = localize(CONFIG.A5E.abilities[abilityKey]);

    let visibilityMode = $state(
        options.visibilityMode ?? game.settings.get("core", "messageMode"),
    );

    let saveType = $state(options.saveType ?? "standard");
    let initialRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let situationalMods = $state(options.situationalMods ?? "");

    let selectedAbilityBonuses = $state(
        actor.BonusesManager.getDefaultSelections("abilities", {
            abilityKey,
            abilityType: "save",
        }),
    );

    let rollModeKey = $derived(getRollModeKey(saveType, abilityKey));
    let expertiseDie = $state(getInitialExpertiseDieSelection());

    let expertiseDieSource = $derived(
        actor.RollOverrideManager.getExpertiseDiceSource(
            rollModeKey,
            options.expertiseDice ?? 0,
        ),
    );

    let saveSrc = $derived(getSaveSrc(saveType, abilityKey));
    let rollModeData = $derived(
        RollOverrideManager.resolveRollMode(saveSrc, initialRollMode),
    );

    let rollMode = $derived(rollModeData.value);
    let rollModeString = $derived(rollModeData.source);

    // let rollMode = $derived(
    //     actor.RollOverrideManager.getRollOverride(rollModeKey, initialRollMode),
    // );

    // let rollModeString = $derived(
    //     actor.RollOverrideManager.getRollOverridesSource(
    //         rollModeKey,
    //         initialRollMode,
    //     ),
    // );

    let buttonText = $derived(getSubmitButtonText(saveType, abilityKey));

    let rollFormula = $derived(
        getRollFormula(actor, {
            ability: abilityKey,
            expertiseDie,
            rollMode,
            saveType,
            situationalMods,
            selectedAbilityBonuses,
            type: "savingThrow",
        }),
    );
</script>

<form>
    <OutputVisibilitySection bind:visibilityMode />

    {#key saveType}
        <RollModePicker
            selected={rollMode}
            source={rollModeString}
            onUpdateSelection={(detail) => (rollMode = detail)}
        />
    {/key}

    <ExpertiseDiePicker
        source={expertiseDieSource}
        selected={expertiseDie}
        type={actor.type}
        onUpdateSelection={(detail) => (expertiseDie = detail)}
    />

    {#if abilityKey === "con" && saveType !== "death"}
        <RadioGroup
            heading="A5E.ItemSavingThrowType"
            options={saveTypes}
            selected={saveType}
            onUpdateSelection={(value) => (saveType = value)}
        />
    {/if}

    {#if Object.values(abilityBonuses).flat().length}
        <CheckboxGroup
            heading="Ability Bonuses"
            options={abilityBonuses.map(([key, abilityBonus]) => [
                key,
                abilityBonus.label || abilityBonus.defaultLabel,
            ])}
            selected={selectedAbilityBonuses}
            onUpdateSelection={(detail) => (selectedAbilityBonuses = detail)}
        />
    {/if}

    <FieldWrapper heading="A5E.SituationalMods">
        <input
            class="a5e-input"
            type="text"
            id="{actor.id}-{appId}-situational-mods"
            bind:value={situationalMods}
        />
    </FieldWrapper>

    <section class="roll-formula-preview">
        {rollFormula}
    </section>

    <section>
        <button
            class="a5e-button"
            onclick={(e) => {
                e.preventDefault();
                onSubmit();
            }}>{buttonText}</button
        >
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
        border: 1px solid vat(--a5e-border-color);
        border-radius: 4px;
    }
</style>
