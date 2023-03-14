<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";

    import RadioGroup from "../components/RadioGroup.svelte";

    export let { application } = getContext("#external");
    export let { actorDocument, appId } = getContext("#external").application;

    const actor = new TJSDocument(actorDocument);

    const restTypeOptions = {
        short: "A5E.RestShort",
        long: "A5E.RestLong",
    };

    let restType = "short";
    let haven = true;
    let supply = true;

    async function rollHitDie(dieSize) {
        try {
            await $actor.rollHitDice(dieSize);
        } catch (e) {
            // TODO: Display a useful error to the user when hit die updates fail
            console.log(e);
            return;
        }
        // Update hit dice quantities for display purposes only
        updateHitDice(dieSize);
    }

    function updateHitDice(dieSize) {
        if (dieSize === "d6")
            hitDice["d6"].current = Math.max(hitDice["d6"].current - 1, 0);
        if (dieSize === "d8")
            hitDice["d8"].current = Math.max(hitDice["d8"].current - 1, 0);
        if (dieSize === "d10")
            hitDice["d10"].current = Math.max(hitDice["d10"].current - 1, 0);
        if (dieSize === "d12")
            hitDice["d12"].current = Math.max(hitDice["d12"].current - 1, 0);
    }

    function onSubmit() {
        application.submit({
            haven,
            restType,
            supply,
        });
    }

    let hitDice = $actor.system.attributes.hitDice;
</script>

<form class="a5e-form u-py-lg u-px-xl a5e-form--reactive-dialog u-bg-none">
    <section class="a5e-form__section">
        <h3 class="u-text-bold u-text-sm u-pb-xs">
            {localize("A5E.RestType")}
        </h3>

        <RadioGroup
            listClasses="u-gap-md u-text-sm"
            optionStyles="padding:0.5rem; text-align: center; width: 5rem"
            options={Object.entries(restTypeOptions)}
            selected={restType}
            on:updateSelection={({ detail }) => (restType = detail)}
        />
    </section>

    {#if restType === "long"}
        <div class="a5e-form__section a5e-form__section--inline">
            <div class="a5e-input-container u-flex u-align-center">
                <input
                    class="a5e-input"
                    for="{appId}-haven"
                    type="checkbox"
                    bind:checked={haven}
                />
                <label
                    for="{appId}-haven"
                    class="u-text-sm u-flex-shrink-0 u-mb-0"
                >
                    {localize("A5E.HavenPrompt")}
                </label>
            </div>
        </div>

        <div class="a5e-form__section a5e-form__section--inline">
            <div class="a5e-input-container u-flex u-align-center">
                <input
                    class="a5e-input"
                    id="{appId}-supply"
                    type="checkbox"
                    bind:checked={supply}
                />

                <label
                    class="u-text-sm u-flex-shrink-0 u-mb-0"
                    for="{appId}-supply"
                >
                    {localize("A5E.SupplyPrompt")}
                </label>
            </div>
        </div>
    {/if}

    {#if restType === "short"}
        <div class="a5e-form__section ">
            <h3 class="u-text-bold u-text-sm u-pb-xs">
                {localize("A5E.HitDiceLabel")}
            </h3>

            <div class="u-flex u-gap-md u-text-md">
                {#each ["d6", "d8", "d10", "d12"] as die}
                    <div class="a5e-hit-die-wrapper">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                            class="a5e-hit-die a5e-hit-die--rollable a5e-hit-die--{die}"
                            class:disabled={hitDice[die].current === 0}
                            on:click={() => rollHitDie(die)}
                        >
                            <span class="a5e-hit-die__label">{die}</span>
                        </div>

                        <span class="a5e-hit-die__quantity">
                            {hitDice[die].current}
                        </span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <button class="a5e-button" on:click|preventDefault={onSubmit}>
        <i class="fas fa-campground" />
        {localize("A5E.Rest")}
    </button>
</form>

<style lang="scss">
</style>
