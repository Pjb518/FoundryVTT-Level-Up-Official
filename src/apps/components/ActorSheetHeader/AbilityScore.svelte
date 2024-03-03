<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import replaceHyphenWithMinusSign from "../../../utils/replaceHyphenWithMinusSign";

    export let ability;
    export let abilityLabel;
    export let idx;

    function handleCheckClick(abilityLabel) {
        if (!sheetIsLocked) return;

        $actor.rollAbilityCheck(
            abilityLabel,
            getKeyPressAsOptions($pressedKeysStore),
        );
    }

    function handleSaveClick(abilityLabel) {
        if (!sheetIsLocked) {
            const currentProficiencyState =
                $actor.system.abilities[abilityLabel]?.save?.proficient;

            $actor.update({
                [`system.abilities.${abilityLabel}.save.proficient`]:
                    !currentProficiencyState,
            });
        } else {
            $actor.rollSavingThrow(
                abilityLabel,
                getKeyPressAsOptions($pressedKeysStore),
            );
        }
    }

    const actor = getContext("actor");

    $: sourceValue = $actor._source.system.abilities[abilityLabel].value;
    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="a5e-ability-score">
    <header class="a5e-ability-score__header">
        <h3 class="a5e-ability-score__label">{abilityLabel}</h3>

        {#if !(!$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true)}
            <button
                on:click={() =>
                    $actor.configureAbilityScore({
                        abilityKey: abilityLabel,
                    })}
                class="a5e-ability-score__config-button fas fa-gear"
            />
        {/if}
    </header>

    <div class="a5e-ability-score__body">
        <input
            class="a5e-ability-score__value"
            name="system.abilities.{abilityLabel}.value"
            type="number"
            value={sheetIsLocked ? ability.value : sourceValue}
            tabindex={idx + 1}
            on:change={({ target }) =>
                updateDocumentDataFromField(
                    $actor,
                    target.name,
                    Number(target.value),
                )}
            placeholder="10"
            disabled={sheetIsLocked}
        />

        <button
            class="a5e-ability-score__roll-button a5e-ability-score__roll-button--check"
            data-tooltip={sheetIsLocked ? "A5E.RollAbilityCheck" : null}
            data-tooltip-direction="DOWN"
            on:click={() => handleCheckClick(abilityLabel)}
        >
            <div class="a5e-ability-score__roll-button-value">
                {replaceHyphenWithMinusSign(ability.check.deterministicBonus)}
            </div>
        </button>

        <button
            class="a5e-ability-score__roll-button a5e-ability-score__roll-button--save"
            class:a5e-ability-score__roll-button--proficient={ability.save
                .proficient}
            data-tooltip={sheetIsLocked
                ? "A5E.RollSavingThrow"
                : "Toggle Saving Throw Proficiency"}
            data-tooltip-direction="DOWN"
            on:click={() => handleSaveClick(abilityLabel)}
        >
            <div class="a5e-ability-score__roll-button-value">
                {replaceHyphenWithMinusSign(ability.save.deterministicBonus)}
            </div>
        </button>
    </div>
</li>
