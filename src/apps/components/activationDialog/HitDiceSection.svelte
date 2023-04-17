<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    import prepareHitDice from "../../dataPreparationHelpers/prepareHitDice";

    export let consumers;
    export let hitDiceData;

    const actor = getContext("actor");
    const actionId = getContext("actionId");
    const item = getContext("item");

    function getConsumer(consumers) {
        if (foundry.utils.isEmpty(consumers.hitDice)) return null;
        const [hitDice] = Object.values(consumers.hitDice);
        if (foundry.utils.isEmpty(hitDice)) return null;
        return hitDice[1];
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
        []
    );

    // =======================================================
    // Consumer data
    const hitDiceConsumer = getConsumer(consumers);

    hitDiceData.selected = Object.fromEntries(
        availableHitDice.map((hd) => [hd, 0])
    );
    hitDiceData.default = hitDiceConsumer.default;

    let hitDice = $actor.system.attributes.hitDice;
</script>

<FormSection>
    <section>
        <h3 class="u-text-bold u-text-sm">
            {localize("A5E.HitDiceLabel")}
        </h3>

        <!-- Type -->
        <div class="u-flex u-gap-md">
            {#each availableHitDice as die}
                <div class="hit-die__wrapper">
                    <button
                        class="hit-die__button"
                        class:disabled={hitDice[die].current === 0}
                        disabled={hitDice[die].current === 0}
                        on:click|preventDefault={() => updateSelected(die)}
                        on:auxclick|preventDefault={() =>
                            updateSelected(die, true)}
                    >
                        <span class="hit-die__button--label">
                            {die}
                        </span>
                    </button>

                    <span class="hit-die--selected">
                        {hitDiceData.selected[die]}
                    </span>
                    /
                    <span class="hit-die--quantity">
                        {hitDice[die].current}
                    </span>
                </div>
            {/each}
        </div>

        <!-- Roll? -->
    </section>
</FormSection>

<style lang="scss">
</style>
