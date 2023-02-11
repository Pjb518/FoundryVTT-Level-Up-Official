<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FormSection from "../components/FormSection.svelte";

    import constructRollFormula from "../../modules/dice/constructRollFormula";
    import getExpertiseDieSize from "../../modules/utils/getExpertiseDieSize";

    export let { actorDocument, abilityKey, dialog } =
        getContext("#external").application;

    const rollModeOptions = Object.entries(CONFIG.A5E.rollModes).map(
        ([key, value]) => ({
            id: key,
            name: game.i18n.localize(value),
            value: CONFIG.A5E.ROLL_MODE[key.toUpperCase()],
        })
    );

    const actor = new TJSDocument(actorDocument);
    const appId = dialog.id;

    const buttonText = `Roll ${localize(
        CONFIG.A5E.abilities[abilityKey]
    )} Check`;

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let expertiseDie = $actor.system.abilities[abilityKey]?.check.expertiseDice;
    let rollMode = CONFIG.A5E.ROLL_MODE.NORMAL;
    let rollFormula;
    let situationalMods = "";

    $: rollFormula = constructRollFormula($actor, rollMode, [
        {
            label: `${localize(CONFIG.A5E.abilities[abilityKey])} Mod`,
            value: $actor.system.abilities[abilityKey].check.mod,
        },
        {
            label: `${localize(CONFIG.A5E.abilities[abilityKey])} Check Bonus`,
            value: $actor.system.abilities[abilityKey].check.bonus,
        },
        {
            label: "Global Check Bonus",
            value: $actor.system.bonuses.abilities.check,
        },
        {
            label: "Expertise Die",
            value: getExpertiseDieSize(expertiseDie),
        },
        {
            value: situationalMods,
        },
    ]);
</script>

<form>
    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <h3 class="heading">Roll Mode</h3>

        <div
            class="
                u-flex
                u-flex-wrap
                u-list-style-none
                u-m-0
                u-p-0
                u-w-full
                u-gap-md
                u-text-sm
            "
            role="radiogroup"
            id={`${$actor.id}-${appId}-rollMode`}
        >
            {#each rollModeOptions as { id, name, value }}
                <input
                    class="u-hidden"
                    type="radio"
                    id={`${$actor.id}-${appId}-rollMode-${id}`}
                    bind:group={rollMode}
                    {value}
                />
                <label
                    class="a5e-tag u-pointer u-p-md u-text-center"
                    class:a5e-tag--inactive={value !== rollMode}
                    for={`${$actor.id}-${appId}-rollMode-${id}`}
                >
                    {name}
                </label>
            {/each}
        </div>
    </section>

    <FormSection heading="A5E.ExpertiseDie">
        <ExpertiseDiePicker
            selected={expertiseDie}
            on:updateSelection={(event) => {
                expertiseDie = event.detail;
            }}
        />
    </FormSection>

    <section class="a5e-box u-flex u-flex-wrap u-gap-sm u-p-md u-pos-relative">
        <label class="heading" for={`${$actor.id}-${appId}-situational-mods`}>
            {localize("A5E.SituationalMods")}
        </label>

        <input
            class="a5e-input"
            type="text"
            id={`${$actor.id}-${appId}-situational-mods`}
            bind:value={situationalMods}
        />
    </section>

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

    .heading {
        display: block;
        font-weight: bold;
        font-size: 0.833rem;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: 0.833rem;
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
