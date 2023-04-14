<script>
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    import prepareHitDice from "../../dataPreparationHelpers/prepareHitDice";

    export let consumers;
    export let hitDiceData;

    function getConsumer(consumers) {
        if (foundry.utils.isEmpty(consumers.hitDice)) return null;
        const [hitDice] = Object.values(consumers.hitDice);
        if (foundry.utils.isEmpty(hitDice)) return null;
        return hitDice[1];
    }

    const actor = getContext("actor");
    const actionId = getContext("actionId");
    const item = getContext("item");

    const hitDice = prepareHitDice($actor);
    const availableHitDice = hitDice.reduce((acc, { die, current, total }) => {
        if (total > 0) acc.push({ die, current, total });
        return acc;
    }, []);

    const defaultSelection = availableHitDice?.[0]?.die ?? "";

    // =======================================================
    // Consumer data
    const hitDiceConsumer = getConsumer(consumers);

    hitDiceData.quantity = hitDiceConsumer.quantity ?? 1;
    hitDiceData.default = hitDiceConsumer.default;
</script>

<FormSection>
    <section>
        <h3 class="u-text-bold u-text-sm">
            {localize("A5E.HitDiceLabel")}
        </h3>

        <!-- Type -->

        <!-- Quantity -->

        <!-- Roll? -->
    </section>
</FormSection>
