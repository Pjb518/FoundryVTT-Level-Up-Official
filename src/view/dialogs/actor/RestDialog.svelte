<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";

    type Props = {
        document: Actor;
        dialog: any;
    };

    async function rollHitDie(dieSize: string) {
        try {
            await actor.rollHitDice(dieSize, 1, healOnDieRoll);
        } catch (e) {
            // TODO: Error System - Display a useful error to the user when hit die updates fail
            console.log(e);
            return;
        }
    }

    function onSubmit(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        dialog.submit({
            consumeSupply: simpleRests ? false : consumeSupply,
            haven: simpleRests ? true : haven,
            restType,
            ignoreSupply: simpleRests ? true : ignoreSupply,
            ignoreObjectRecharge,
            supplyAmount,
        });
    }

    let { document, dialog }: Props = $props();
    const actor: any = document;
    let actorStore = $derived(actor.reactive.system);

    const restTypeOptions = {
        short: "A5E.rest.short",
        long: "A5E.rest.long",
    };

    const consumeSupplyByDefault =
        game.settings.get("a5e", "consumeSupplyByDefault") ?? false;

    let restType = $state("short");
    let haven = $state(!consumeSupplyByDefault);
    let ignoreSupply = $state(!consumeSupplyByDefault);
    let simpleRests = game.settings.get("a5e", "simpleRests");
    let consumeSupply = $state(consumeSupplyByDefault);
    let supplyAmount = $state(0);
    let ignoreObjectRecharge = $state(false);

    let healOnDieRoll = $state(true);

    let hitDice = $derived(actorStore.attributes.hitDice);
</script>

<form class="form">
    <RadioGroup
        heading="A5E.rest.type"
        options={Object.entries(restTypeOptions)}
        selected={restType}
        onUpdateSelection={(detail) => (restType = detail)}
    />

    <hr class="a5e-rule" />

    {#if restType === "long" && !simpleRests}
        <Section
            --a5e-section-body-padding="0"
            --a5e-section-body-gap="0.75rem"
        >
            <FieldWrapper>
                <Checkbox
                    label="A5E.rest.havenPrompt"
                    checked={haven}
                    onUpdateSelection={(checked) => {
                        if (checked === false) {
                            consumeSupply = true;
                            ignoreSupply = false;
                        }
                        haven = checked;
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <Checkbox
                    label="A5E.supply.ignoreSupply"
                    checked={ignoreSupply}
                    onUpdateSelection={(checked) => {
                        ignoreSupply = checked;
                        if (checked) consumeSupply = false;
                    }}
                />
            </FieldWrapper>

            {#if actor.type === "character"}
                {#if !ignoreSupply}
                    <FieldWrapper>
                        <Checkbox
                            label="A5E.supply.consume"
                            checked={consumeSupply}
                            onUpdateSelection={(detail) => {
                                consumeSupply = detail;
                            }}
                        />
                    </FieldWrapper>
                {/if}

                {#if consumeSupply && !ignoreSupply}
                    <div class="supply-amount-wrapper">
                        <input
                            class="a5e-input a5e-input--small a5e-input--slim"
                            type="number"
                            bind:value={supplyAmount}
                        />

                        <label for="">
                            {localize("A5E.supply.supplyAmount")}
                        </label>
                    </div>
                {/if}

                {#if consumeSupply && !actor.system.supply && !ignoreSupply}
                    <div class="supply-warning">
                        <i class="fa-solid fa-warning"></i>
                        {localize("A5E.rest.noSupplyWarning", {
                            name: actor.name,
                        })}
                    </div>
                {/if}
            {/if}

            <Checkbox
                label="Ignore Recharging of Objects"
                checked={ignoreObjectRecharge}
                onUpdateSelection={(value) => (ignoreObjectRecharge = value)}
            />
        </Section>
    {/if}

    {#if restType === "short"}
        <Section --a5e-section-body-padding="0" --a5e-section-body-gap="1rem">
            <FieldWrapper heading="A5E.hitDice.title">
                <div class="a5e-hit-die-container">
                    {#each ["d6", "d8", "d10", "d12"] as die}
                        <div class="a5e-hit-die-wrapper">
                            <!-- svelte-ignore a11y_click_events_have_key_events -->
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <div
                                class="a5e-hit-die a5e-hit-die--rollable a5e-hit-die--{die}"
                                class:disabled={hitDice[die].current === 0}
                                onclick={() => rollHitDie(die)}
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

            <Checkbox
                label="Heal while rolling Hit Dice."
                checked={healOnDieRoll}
                onUpdateSelection={(checked) => (healOnDieRoll = checked)}
            />
        </Section>
    {/if}

    <button class="a5e-button" onclick={(e) => onSubmit(e)}>
        <i class="icon fas fa-campground"></i>
        {localize("A5E.rest.title")}
    </button>
</form>

<style lang="scss">
    .form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.75rem;
    }

    .a5e-hit-die-container {
        display: flex;
        font-size: var(--a5e-md-text);
        gap: 0.5rem;
    }

    .supply-amount-wrapper {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: var(--a5e-sm-text);
    }

    .supply-warning {
        color: var(--a5e-color-disadvantage);
        font-size: var(--a5e-sm-text);
    }
</style>
