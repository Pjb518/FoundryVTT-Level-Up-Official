<script lang="ts">
    import { getContext } from "svelte";

    import { pressedKeys } from "#stores/pressedKeysStore.svelte.ts";

    import { replaceHyphenWithMinusSign } from "#utils/replaceHyphenWithMinusSign.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";
    import { getKeyPressAsOptions } from "#utils/view/getKeyPressAsOptions.ts";

    type Props = {
        ability: any;
        abilityKey: string;
        idx: number;
    };

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let { ability, abilityKey, idx }: Props = $props();

    function handleCheckClick(abilityKey: string) {
        if (!sheetIsLocked()) return;

        actor.rollAbilityCheck(abilityKey, getKeyPressAsOptions(pressedKeys));
    }

    function handleSaveClick(abilityKey: string) {
        if (!sheetIsLocked()) {
            const currentProficiencyState =
                actor.system.abilities[abilityKey]?.save?.proficient;

            actor.update({
                [`system.abilities.${abilityKey}.save.proficient`]:
                    !currentProficiencyState,
            });
        } else {
            actor.rollSavingThrow(abilityKey, getKeyPressAsOptions(pressedKeys));
        }
    }

    let sourceValue = $derived(actor.reactive._source.system.abilities[abilityKey].value);
</script>

<li class="a5e-ability-score">
    <header class="a5e-ability-score__header">
        <h3 class="a5e-ability-score__label">
            {abilityKey}
        </h3>

        {#if !(!actor.isOwner ? true : (sheetIsLocked() ?? true))}
            <button
                class="a5e-button a5e-button--config a5e-ability-score__config-button"
                aria-labelledby="Configure Ability Score"
                onclick={() => actor.configureAbilityScore({ abilityKey })}
            >
                <i class="fas fa-cog"></i>
            </button>
        {/if}
    </header>

    <div class="a5e-ability-score__body">
        <input
            class="a5e-ability-score__value"
            name="system.abilities.${abilityKey}.value"
            type="number"
            value={sheetIsLocked() ? ability.value : sourceValue}
            placeholder="10"
            disabled={sheetIsLocked()}
            onchange={({ target }) =>
                updateDocumentDataFromField(
                    actor,
                    // @ts-ignore
                    target.name,
                    // @ts-ignore
                    Number(target.value),
                )}
        />

        <button
            class="a5e-ability-score__roll-button a5e-ability-score__roll-button--check"
            class:a5e-ability-score__roll-button--no-click={!sheetIsLocked()}
            data-tooltip={sheetIsLocked() ? "A5E.rollLabels.abilityCheck" : null}
            data-tooltip-direction="DOWN"
            onclick={() => handleCheckClick(abilityKey)}
        >
            <div class="a5e-ability-score__roll-button-value">
                {replaceHyphenWithMinusSign(ability.check.deterministicBonus)}
            </div>
        </button>

        <button
            class="a5e-ability-score__roll-button a5e-ability-score__roll-button--save"
            class:a5e-ability-score__roll-button--proficient={ability.save.proficient}
            data-tooltip={sheetIsLocked()
                ? "A5E.rollLabels.savingThrow"
                : "Toggle Saving Throw Proficiency"}
            data-tooltip-direction="DOWN"
            onclick={() => handleSaveClick(abilityKey)}
        >
            <div class="a5e-ability-score__roll-button-value">
                {replaceHyphenWithMinusSign(ability.save.deterministicBonus)}
            </div>
        </button>
    </div>
</li>
