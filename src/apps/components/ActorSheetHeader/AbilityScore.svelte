<script>
    import { getContext } from "svelte";

    import pressedKeysStore from "../../../stores/pressedKeysStore";

    import getKeyPressAsOptions from "../../handlers/getKeyPressAsOptions";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";
    import replaceHyphenWithMinusSign from "../../../utils/replaceHyphenWithMinusSign";

    export let ability;
    export let abilityLabel;
    export let idx;

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="a5e-ability-score">
    <div class="a5e-ability-score__main">
        <h3 class="a5e-ability-score__label">{abilityLabel}</h3>

        <input
            class="a5e-ability-score__value"
            name="system.abilities.{abilityLabel}.value"
            type="number"
            value={ability.value}
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
    </div>

    <button
        class="a5e-roll-button"
        data-tooltip="A5E.RollAbilityCheck"
        data-tooltip-direction="DOWN"
        on:click={() =>
            $actor.rollAbilityCheck(
                abilityLabel,
                getKeyPressAsOptions($pressedKeysStore),
            )}
    >
        <h4 class="a5e-roll-button__label">Check</h4>

        <div class="a5e-roll-button__value">
            {replaceHyphenWithMinusSign(ability.check.deterministicBonus)}
        </div>
    </button>

    <button
        class="a5e-roll-button"
        data-tooltip="A5E.RollSavingThrow"
        data-tooltip-direction="DOWN"
        on:click={() =>
            $actor.rollSavingThrow(
                abilityLabel,
                getKeyPressAsOptions($pressedKeysStore),
            )}
    >
        <h4 class="a5e-roll-button__label">Save</h4>

        <div class="a5e-roll-button__value">
            {replaceHyphenWithMinusSign(ability.save.deterministicBonus)}
        </div>
    </button>

    {#if !(!$actor.isOwner ? true : $actor.flags?.a5e?.sheetIsLocked ?? true)}
        <button
            on:click={() =>
                $actor.configureAbilityScore({ abilityKey: abilityLabel })}
            class="fas fa-gear a5e-button--edit-config"
        />
    {/if}
</li>
