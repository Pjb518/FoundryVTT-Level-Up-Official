<script>
    import rollAbilityCheck from "../handlers/rollAbilityCheck";
    import rollSavingThrow from "../handlers/rollSavingThrow";

    import localize from "../utils/localize";
    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let ability;
    export let abilityLabel;
    export let actor;
</script>

<div>
    <li
        class="u-align-center u-bg-gray u-flex u-flex-col u-font-serif u-py-xs u-rounded u-w-full"
    >
        <input
            class="a5e-ability-score__value"
            name={`system.abilities.${abilityLabel}.value`}
            type="number"
            value={ability.value}
            on:change={({ target }) =>
                updateDocumentDataFromField($actor, target.name, target.value)}
            placeholder="10"
        />

        <div class="a5e-ability-score__buttons">
            <div
                class="a5e-ability-score__roll-button a5e-js-roll-saving-throw"
                title={localize("A5E.RollSavingThrow")}
                on:click={(event) =>
                    rollAbilityCheck($actor, abilityLabel, event)}
            >
                {ability.check.deterministicBonus}

                <div class="a5e-tooltip a5e-tooltip--ability-score">
                    {localize("A5E.RollSavingThrow")}
                </div>
            </div>

            <div
                class="a5e-ability-score__roll-button a5e-js-roll-saving-throw"
                title={localize("A5E.RollSavingThrow")}
                on:click={(event) =>
                    rollSavingThrow($actor, abilityLabel, event)}
            >
                {ability.save.deterministicBonus}

                <div class="a5e-tooltip a5e-tooltip--ability-score">
                    {localize("A5E.RollSavingThrow")}
                </div>
            </div>
        </div>
    </li>
</div>
