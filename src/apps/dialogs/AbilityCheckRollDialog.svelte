<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import constructRollFormula from "../../modules/dice/constructRollFormula";

    export let { actorDocument, abilityKey, dialog } =
        getContext("#external").application;

    const expertiseDieOptions = [
        { name: game.i18n.localize("A5E.None"), value: 0 },
        { name: "d4", value: 1 },
        { name: "d6", value: 2 },
        { name: "d8", value: 3 },
        { name: "d10", value: 4 },
        { name: "d12", value: 5 },
    ];

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => ({
            id: key,
            name: game.i18n.localize(value),
            value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        })
    );

    const actor = new TJSDocument(actorDocument);
    const appId = dialog.id;

    let expertiseDie = $actor.system.abilities[abilityKey].check.expertiseDice;
    let rollMode = CONFIG.A5E.ROLL_MODE.NORMAL;
    let rollFormula;
    let situationalMods = "";

    $: rollFormula = constructRollFormula(
        $actor,
        `${$actor.system.abilities[abilityKey].check.mod}[Ability Mod]`,
        expertiseDie,
        rollMode,
        situationalMods
    );
</script>

<form>
    <div role="radiogroup" id={`${$actor.id}-${appId}-rollMode`}>
        {#each rollModeOptions as { id, name, value }}
            <input
                type="radio"
                id={`${$actor.id}-${appId}-rollMode-${id}`}
                bind:group={rollMode}
                {value}
            />
            <label for={`${$actor.id}-${appId}-rollMode-${id}`}>
                {name}
            </label>
        {/each}
    </div>

    <div role="radiogroup" id={`${$actor.id}-${appId}-expertise`}>
        {#each expertiseDieOptions as { name, value }}
            <input
                type="radio"
                id={`${$actor.id}-${appId}-expertise-${name}`}
                bind:group={expertiseDie}
                {value}
            />
            <label for={`${$actor.id}-${appId}-expertise-${name}`}>
                {name}
            </label>
        {/each}
    </div>

    <div>
        <label for={`${$actor.id}-${appId}-situational-mods`}>
            {localize("A5E.SituationalMods")}
        </label>

        <input
            type="text"
            id={`${$actor.id}-${appId}-situational-mods`}
            bind:value={situationalMods}
        />
    </div>

    <div>
        {rollFormula}
    </div>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
    }
</style>
