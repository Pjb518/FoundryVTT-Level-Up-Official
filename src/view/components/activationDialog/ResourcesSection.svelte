<script lang="ts">
    import { getContext } from "svelte";
    import { ResourceConsumptionManager } from "#managers/ResourceConsumptionManager.ts";
    import type { RollStateManager } from "#managers/RollStateManager.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        consumers: NonNullable<RollStateManager.state["consumers"]["resource"]>;
        resourceData: RollStateManager.ActionDialogData["consumptionData"]["resources"];
    };

    let { consumers, resourceData = $bindable() }: Props = $props();

    let actor: Actor.OfType<"base"> = getContext("actor");

    // Setup resourceData
    const data = $state(
        consumers.map((consumer) => {
            const d = consumer.getActivationData(actor);
            resourceData[consumer.id] = d.usesData;
            return [consumer.id, d];
        }),
    );
</script>

<div class="a5e-action-dialog-resources">
    {#each data as [id, consumerData]}
        <FieldWrapper heading={consumerData.label}>
            <input
                class="a5e-input a5e-input--small a5e-input--slim"
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
    .a5e-action-dialog-resources {
        display: flex;
    }
</style>
