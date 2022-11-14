<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import rollAbilityCheck from "../../handlers/rollAbilityCheck";
    import rollSavingThrow from "../../handlers/rollSavingThrow";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let ability;
    export let abilityLabel;

    const actor = getContext("actor");
</script>

<div class="ability-score">
    <h3>{localize(abilityLabel)}</h3>

    <input
        class="ability-score-value"
        name={`system.abilities.${abilityLabel}.value`}
        type="number"
        value={ability.value}
        on:change={({ target }) =>
            updateDocumentDataFromField($actor, target.name, target.value)}
        placeholder="10"
    />

    {#if !($actor.flags?.a5e?.sheetIsLocked ?? true)}
        <i class="fas fa-gear a5e-config-button" />
    {/if}
</div>

<div class="ability-score-buttons">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="roll-button"
        data-tooltip="A5E.RollAbilityCheck"
        data-tooltip-direction="DOWN"
        on:click={(event) => rollAbilityCheck($actor, abilityLabel, event)}
    >
        <h4 class="roll-button-label">Check</h4>

        <div class="roll-button-value">
            {ability.check.deterministicBonus}
        </div>
    </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="roll-button"
        data-tooltip="A5E.RollSavingThrow"
        data-tooltip-direction="DOWN"
        on:click={(event) => rollSavingThrow($actor, abilityLabel, event)}
    >
        <h4 class="roll-button-label">Save</h4>

        <div class="roll-button-value">
            {ability.save.deterministicBonus}
        </div>
    </div>
</div>

<style lang="scss">
    .ability-score {
        &-buttons {
            display: flex;
            width: 100%;
            height: fit-content;
            align-items: center;
            gap: 0.25rem;
            font-size: 1rem;
        }

        &-value {
            display: flex;
            align-items: center;
            height: 26px;
            border: 0;
            color: #191813;
            margin-bottom: 0;
            background: none;
            font-size: 1.44rem;
            font-weight: inherit;
            text-align: center;

            &:focus {
                box-shadow: none;
            }

            &::placeholder {
                color: lighten(#191813, 35%);
            }
        }
    }

    .ability-score,
    .roll-button {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        padding: 0.125rem 0;
        font-family: "Modesto Condensed", serif;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f6f2eb;
        box-shadow: 0 0 5px #ccc inset;
    }

    .roll-button {
        cursor: pointer;

        &-label {
            font-size: 0.694rem;
        }

        &-value {
            color: #191813;
        }
    }

    .a5e-config-button {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
    }
</style>
