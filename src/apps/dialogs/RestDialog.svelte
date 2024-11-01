<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";
    import Section from "../components/Section.svelte";

    export let { application } = getContext("#external");
    export let { document, appId } = getContext("#external").application;

    const actor = document;

    const restTypeOptions = {
        short: "A5E.RestShort",
        long: "A5E.RestLong",
    };

    let restType = "short";
    let haven = true;
    let recoverStrifeAndFatigue = true;
    let simpleRests = game.settings.get("a5e", "simpleRests");
    let consumeSupply = false;

    async function rollHitDie(dieSize) {
        try {
            await $actor.rollHitDice(dieSize);
        } catch (e) {
            // TODO: Error System - Display a useful error to the user when hit die updates fail
            console.log(e);
            return;
        }
    }

    function onSubmit() {
        const simpleRests = game.settings.get("a5e", "simpleRests");

        application.submit({
            consumeSupply: simpleRests ? false : consumeSupply,
            haven: simpleRests ? true : haven,
            restType,
            recoverStrifeAndFatigue: simpleRests ? true : recoverStrifeAndFatigue,
        });
    }

    $: hitDice = $actor.system.attributes.hitDice;
</script>

<form class="form">
    <RadioGroup
        heading="A5E.RestType"
        options={Object.entries(restTypeOptions)}
        selected={restType}
        on:updateSelection={({ detail }) => (restType = detail)}
    />

    {#if restType === "long" && !simpleRests}
        <Section --a5e-section-body-padding="0" --a5e-section-body-gap="0.75rem">
            <FieldWrapper>
                <Checkbox
                    label="A5E.HavenPrompt"
                    checked={haven}
                    on:updateSelection={({ detail }) => {
                        haven = detail;
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <Checkbox
                    label="A5E.SupplyFatigueStrifePrompt"
                    checked={recoverStrifeAndFatigue}
                    on:updateSelection={({ detail }) => {
                        recoverStrifeAndFatigue = detail;
                    }}
                />
            </FieldWrapper>

            {#if $actor.type === "character"}
                <FieldWrapper>
                    <Checkbox
                        label="A5E.SupplyConsume"
                        checked={consumeSupply}
                        on:updateSelection={({ detail }) => {
                            consumeSupply = detail;
                        }}
                    />
                </FieldWrapper>
            {/if}
        </Section>
    {/if}

    {#if restType === "short"}
        <Section --a5e-section-body-padding="0">
            <FieldWrapper heading="A5E.HitDiceLabel">
                <div class="u-flex u-gap-md u-text-md">
                    {#each ["d6", "d8", "d10", "d12"] as die}
                        <div class="a5e-hit-die-wrapper">
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
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
            </FieldWrapper>
        </Section>
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
        gap: 0.75rem;
        padding: 0.75rem;
    }
</style>
