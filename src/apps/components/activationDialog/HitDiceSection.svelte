<script lang="ts">
    import type { BaseActorA5e } from "../../../documents/actor/base";
    import type { ConsumerHandlerReturnType } from "../../dataPreparationHelpers/itemActivationConsumers/prepareConsumers";
    // import type { TJSDocument } from '#runtime/svelte/store/fvtt/document';

    import { getContext } from "svelte";

    import { ResourceConsumptionManager } from "../../../managers/ResourceConsumptionManager";

    import FieldWrapper from "../FieldWrapper.svelte";

    export let consumers: ConsumerHandlerReturnType;
    export let hitDiceData: ResourceConsumptionManager.HitDiceConsumerData;

    function updateSelected(dieSize, remove = false) {
        const quantity = hitDiceData.selected[dieSize];
        const newValue = remove ? quantity - 1 : quantity + 1;

        hitDiceData.selected[dieSize] = Math.max(newValue, 0);
    }

    const actor: TJSDocument<BaseActorA5e> = getContext("actor");
    const parts = ResourceConsumptionManager.prepareHitDiceData(
        $actor,
        consumers,
    );

    const { availableHitDice } = parts;
    hitDiceData = parts.hitDiceData;

    let hitDice = $actor.system.attributes.hitDice;
</script>

<FieldWrapper heading="A5E.HitDiceLabel">
    <!-- Type -->
    <div class="u-flex u-gap-md u-text-md">
        {#each availableHitDice as die}
            <div class="a5e-hit-die-wrapper">
                <button
                    class="a5e-hit-die a5e-hit-die--rollable a5e-hit-die--{die}"
                    class:disabled={hitDice[die].current === 0}
                    disabled={hitDice[die].current === 0}
                    on:click|preventDefault={() => updateSelected(die)}
                    on:auxclick|preventDefault={() => updateSelected(die, true)}
                >
                    <span class="a5e-hit-die__label">{die}</span>
                </button>

                <div class="quantity__wrapper">
                    <input
                        type="number"
                        min="0"
                        max={hitDice[die].current}
                        bind:value={hitDiceData.selected[die]}
                    />

                    /

                    <input
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

        input {
            width: 2.5rem;
            height: 1.5rem;
            text-align: center;
        }
    }
</style>
