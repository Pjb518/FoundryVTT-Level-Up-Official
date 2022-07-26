<script>
    import { getContext } from "svelte";

    import rollAbilityCheck from "../../handlers/rollAbilityCheck";
    import rollSavingThrow from "../../handlers/rollSavingThrow";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let ability;
    export let abilityLabel;

    const actor = getContext("actor");
</script>

<input
    class="ability-score-value"
    name={`system.abilities.${abilityLabel}.value`}
    type="number"
    value={ability.value}
    on:change={({ target }) =>
        updateDocumentDataFromField($actor, target.name, target.value)}
    placeholder="10"
/>

<div class="ability-score-buttons">
    <div
        class="ability-score-roll-button"
        on:click={(event) => rollAbilityCheck($actor, abilityLabel, event)}
        data-tooltip="A5E.RollAbilityCheck"
        data-tooltip-direction="DOWN"
    >
        {ability.check.deterministicBonus}
    </div>

    <div
        class="ability-score-roll-button"
        on:click={(event) => rollSavingThrow($actor, abilityLabel, event)}
        data-tooltip="A5E.RollSavingThrow"
        data-tooltip-direction="DOWN"
    >
        {ability.save.deterministicBonus}
    </div>
</div>

<style lang="scss">
    .ability-score {
        &-buttons {
            display: flex;
            width: 100%;
            height: 1.5rem;
            align-items: center;
            justify-content: space-around;
            font-size: 1rem;
        }

        &-roll-button {
            position: relative;
            display: flex;
            width: 1.5rem;
            height: 1.5rem;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            background: #f6f2eb;
            border-radius: 100px;
            box-shadow: 0 0 7.5px #ccc inset;
            cursor: pointer;
        }

        &-value {
            display: flex;
            align-items: center;
            height: 26px;
            border: 0;
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
</style>
