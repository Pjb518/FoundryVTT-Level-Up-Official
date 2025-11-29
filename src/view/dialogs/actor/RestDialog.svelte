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
            await actor.rollHitDice(dieSize);
        } catch (e) {
            // TODO: Error System - Display a useful error to the user when hit die updates fail
            console.log(e);
            return;
        }
    }

    function onSubmit(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const simpleRests = game.settings.get("a5e", "simpleRests");

        dialog.submit({
            consumeSupply: simpleRests ? false : consumeSupply,
            haven: simpleRests ? true : haven,
            restType,
            recoverStrifeAndFatigue: simpleRests ? true : recoverStrifeAndFatigue,
        });
    }

    let { document, dialog }: Props = $props();
    const actor: any = document;
    let actorStore = $derived(actor.reactive.system);

    const restTypeOptions = {
        short: "A5E.rest.short",
        long: "A5E.rest.long",
    };

    let restType = $state("short");
    let haven = $state(true);
    let recoverStrifeAndFatigue = $state(true);
    let simpleRests = game.settings.get("a5e", "simpleRests");
    let consumeSupply = $state(false);

    let hitDice = $derived(actorStore.attributes.hitDice);
</script>

<form class="form">
    <RadioGroup
        heading="A5E.rest.type"
        options={Object.entries(restTypeOptions)}
        selected={restType}
        onUpdateSelection={(detail) => (restType = detail)}
    />

    {#if restType === "long" && !simpleRests}
        <Section --a5e-section-body-padding="0" --a5e-section-body-gap="0.75rem">
            <FieldWrapper>
                <Checkbox
                    label="A5E.rest.havenPrompt"
                    checked={haven}
                    onUpdateSelection={(detail) => {
                        haven = detail;
                    }}
                />
            </FieldWrapper>

            <FieldWrapper>
                <Checkbox
                    label="A5E.supply.fatigueStrifePrompt"
                    checked={recoverStrifeAndFatigue}
                    onUpdateSelection={(detail) => {
                        recoverStrifeAndFatigue = detail;
                    }}
                />
            </FieldWrapper>

            {#if actor.type === "character"}
                <FieldWrapper>
                    <Checkbox
                        label="A5E.supply.consume"
                        checked={consumeSupply}
                        onUpdateSelection={(detail) => {
                            consumeSupply = detail;
                        }}
                    />
                </FieldWrapper>
                {#if consumeSupply && !actor.system.supply}
                    <div class="a5e-section__hint">
                        {localize("A5E.rest.noSupplyWarning", { name: actor.name })}
                    </div>
                {/if}
            {/if}
        </Section>
    {/if}

    {#if restType === "short"}
        <Section --a5e-section-body-padding="0">
            <FieldWrapper heading="A5E.hitDice.title">
                <div class="u-flex u-gap-md u-text-md">
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
</style>
