<script lang="ts">
    import { getContext } from "svelte";
    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";
    import type { RollStateManager } from "#managers/RollStateManager.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        consumer: RollStateManager.state["consumers"]["hitDice"];
        hitDiceData: ResourceConsumptionManager.HitDiceConsumerData;
    };

    function updateSelected(dieSize: string, remove = false) {
        const quantity = hitDiceData.selected[dieSize];
        const newValue = remove ? quantity - 1 : quantity + 1;

        hitDiceData.selected[dieSize] = Math.max(newValue, 0);
    }

    let { consumer, hitDiceData = $bindable() }: Props = $props();

    let actor: Actor.OfType<"base"> = getContext("actor");

    const availableHitDice = actor.HitDiceManager.availableList;
    hitDiceData = consumer?.getActivationData(actor) ?? {
        selected: {},
        quantity: 1,
    };

    let hitDice = $derived(actor.reactive.system.attributes.hitDice);
</script>

<FieldWrapper heading="A5E.hitDice.title">
    <!-- Type -->
    <div class="a5e-hit-die-container">
        {#each availableHitDice as die}
            <div class="a5e-hit-die-wrapper">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <button
                    type="button"
                    style:--a5e-hit-die-width={availableHitDice.length > 1
                        ? "100%"
                        : "auto"}
                    class="a5e-hit-die a5e-hit-die--rollable a5e-hit-die--{die}"
                    class:disabled={hitDice[die].current === 0}
                    disabled={hitDice[die].current === 0}
                    onclick={(e) => {
                        e.preventDefault();
                        updateSelected(die);
                    }}
                    onauxclick={(e) => {
                        e.preventDefault();
                        updateSelected(die, true);
                    }}
                >
                    <span class="a5e-hit-die__label">{die}</span>
                </button>

                <div class="quantity__wrapper">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        min="0"
                        max={hitDice[die].current}
                        bind:value={hitDiceData.selected[die]}
                    />

                    /

                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        value={hitDice[die].current}
                        disabled
                    />
                </div>
            </div>
        {/each}
    </div>
</FieldWrapper>

<style lang="scss">
    .quantity__wrapper {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .a5e-hit-die-container {
        display: flex;
        font-size: var(--a5e-md-text);
        gap: 0.5rem;
    }
</style>
