<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    import prepareHitDice from "../../dataPreparationHelpers/prepareHitDice";
    import FieldWrapper from "../FieldWrapper.svelte";

    export let consumers;
    export let hitDiceData;

    const actor = getContext("actor");

    function getConsumer(consumers) {
        if (foundry.utils.isEmpty(consumers.hitDice)) return null;
        const [_, consumer] = Object.values(consumers.hitDice);
        return consumer;
    }

    function updateSelected(dieSize, remove = false) {
        const quantity = hitDiceData.selected[dieSize];
        const newValue = remove ? quantity - 1 : quantity + 1;

        hitDiceData.selected[dieSize] = Math.max(newValue, 0);
    }

    const availableHitDice = prepareHitDice($actor).reduce(
        (acc, { die, total }) => {
            if (total > 0) acc.push(die);
            return acc;
        },
        [],
    );

    // =======================================================
    // Consumer data
    const hitDiceConsumer = getConsumer(consumers);

    hitDiceData.selected = Object.fromEntries(
        availableHitDice.map((hd, idx) => [hd, idx === 0 ? 1 : 0]),
    );
    hitDiceData.default = hitDiceConsumer.default;

    let hitDice = $actor.system.attributes.hitDice;
</script>

<FieldWrapper heading="A5E.HitDiceLabel">
    <!-- Type -->
    <div class="u-flex u-gap-lg u-flex-wrap">
        {#each availableHitDice as die}
            <div class="hit-die__wrapper">
                <button
                    class="hit-die__button"
                    class:disabled={hitDice[die].current === 0}
                    disabled={hitDice[die].current === 0}
                    on:click|preventDefault={() => updateSelected(die)}
                    on:auxclick|preventDefault={() => updateSelected(die, true)}
                >
                    <span class="hit-die__button--label">
                        {die}
                    </span>
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
    .hit-die__wrapper {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

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
