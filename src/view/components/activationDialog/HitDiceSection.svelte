<script lang="ts">
    import type { ConsumerHandlerReturnType } from "../../../apps/dataPreparationHelpers/itemActivationConsumers/prepareConsumers.ts";
    import { getContext } from "svelte";

    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import { preventDefault } from "svelte/legacy";

    type Props = {
        consumers: ConsumerHandlerReturnType;
        hitDiceData: ResourceConsumptionManager.HitDiceConsumerData;
    };

    function updateSelected(dieSize: string, remove = false) {
        const quantity = hitDiceData.selected[dieSize];
        const newValue = remove ? quantity - 1 : quantity + 1;

        hitDiceData.selected[dieSize] = Math.max(newValue, 0);
    }

    let { consumers, hitDiceData = $bindable() }: Props = $props();

    let actor: Actor = getContext("actor");
    let parts = ResourceConsumptionManager.prepareHitDiceData(actor, consumers);

    const { availableHitDice } = parts;
    hitDiceData = parts.hitDiceData;

    let hitDice = actor.system.attributes.hitDice;
</script>

<FieldWrapper heading="A5E.hitDice.title">
    <!-- Type -->
    <div class="u-flex u-gap-md u-text-md">
        {#each availableHitDice as die}
            <div class="a5e-hit-die-wrapper">
                <button
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
</style>
