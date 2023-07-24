<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import Checkbox from "../components/Checkbox.svelte";
    import FormSection from "../components/FormSection.svelte";
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
    let recoverStrifeAndFatigue = true;
    let consumeSupply = false;

    async function rollHitDie(dieSize) {
        try {
            await $actor.rollHitDice(dieSize);
        } catch (e) {
            // TODO: Display a useful error to the user when hit die updates fail
            console.log(e);
            return;
        }
    }

    function onSubmit() {
        application.submit({
            consumeSupply,
            haven,
            restType,
            recoverStrifeAndFatigue,
        });
    }

    $: hitDice = $actor.system.attributes.hitDice;
</script>

<form class="form">
    <FormSection heading="A5E.RestType" --direction="column">
        <RadioGroup
            options={Object.entries(restTypeOptions)}
            selected={restType}
            on:updateSelection={({ detail }) => (restType = detail)}
        />
    </FormSection>

    {#if restType === "long"}
        <FormSection>
            <Checkbox
                label="A5E.HavenPrompt"
                checked={haven}
                on:updateSelection={({ detail }) => {
                    haven = detail;
                }}
            />
        </FormSection>

        <FormSection>
            <Checkbox
                label="A5E.SupplyFatigueStrifePrompt"
                checked={recoverStrifeAndFatigue}
                on:updateSelection={({ detail }) => {
                    recoverStrifeAndFatigue = detail;
                }}
            />
        </FormSection>

        {#if $actor.type === "character"}
            <FormSection>
                <Checkbox
                    label="A5E.SupplyConsume"
                    checked={consumeSupply}
                    on:updateSelection={({ detail }) => {
                        consumeSupply = detail;
                    }}
                />
            </FormSection>
        {/if}
    {/if}

    {#if restType === "short"}
        <FormSection heading="A5E.HitDiceLabel" --direction="column">
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
        </FormSection>
    {/if}

    <button class="a5e-button" on:click|preventDefault={onSubmit}>
        <i class="fas fa-campground" />
        {localize("A5E.Rest")}
    </button>
</form>

<style lang="scss">
    .form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }
</style>
