<script lang="ts">
    import { getContext } from "svelte";
    import type { RollStateManager } from "#managers/RollStateManager.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        consumers: NonNullable<RollStateManager.state["consumers"]["resource"]>;
        resourceData: RollStateManager.ActionDialogData["consumptionData"]["resources"];
    };

    function getHint({
        current,
        max,
    }: {
        current: number | null;
        max: number | null;
    }) {
        if (current != null && !max) {
            return `(${current}) Available`;
        }

        if (current != null && max != null) {
            return `(${current}/${max} Available)`;
        }
    }

    let { consumers, resourceData = $bindable() }: Props = $props();

    let actor: Actor.OfType<"base"> = getContext("actor");

    // Setup resourceData
    const data = $state(
        consumers.map((consumer) => {
            const d = consumer.getActivationData(actor);
            resourceData[consumer.id] = d.usesData;
            return [consumer.id, d] satisfies [string, typeof d];
        }),
    );
</script>

<div class="side-by-side">
    {#each data as [id, consumerData]}
        <FieldWrapper heading={consumerData.label} hint={getHint(consumerData)}>
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={consumerData.usesData.quantity}
                onchange={({ currentTarget }) => {
                    foundry.utils.setProperty(
                        resourceData,
                        `${id}.quantity`,
                        Number.parseInt(currentTarget.value, 10),
                    );
                }}
            />
        </FieldWrapper>
    {/each}
</div>

<style lang="scss">
    .side-by-side {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, auto));
        grid-auto-rows: max-content;
        gap: 0.5rem;
    }
</style>
