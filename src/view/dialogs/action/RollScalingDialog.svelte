<script lang="ts">
    import type { ItemA5e } from "#documents/item/item.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Section from "#view/snippets/Section.svelte";
    import type { DamageRollData } from "../../../dataModels/item/actions/ActionRollsDataModel.ts";

    type Props = {
        document: ItemA5e;
        actionId: string;
        rollId?: string;
        propertyKey: string;
        scalingType?: "default" | "roll";
    };

    function getHint(): string {
        const hint = scalingMode ? `A5E.scaling.hints.${scalingMode}` : "";
        // @ts-expect-error
        return _loc(hint);
    }

    function getScalingOptions() {
        return [
            [null, "A5E.None"],
            ...Object.entries(CONFIG.A5E.scalingModes),
        ] as [string, string][];
    }

    let {
        document,
        actionId,
        propertyKey,
        scalingType = "default",
    }: Props = $props();

    let item: ItemA5e = document;

    let scaling = $derived(
        foundry.utils.getProperty(item.reactive.system, propertyKey),
    ) as DamageRollData["scaling"];
    let scalingMode = $derived(scaling.mode ?? null);
</script>

<form class="a5e-scaling-dialog">
    <Section>
        <RadioGroup
            heading="Scaling Mode"
            options={getScalingOptions()}
            selected={scalingMode}
            allowDeselect={false}
            onUpdateSelection={(detail) => {
                updateDocumentDataFromField(
                    item,
                    `system.${propertyKey}.mode`,
                    detail,
                );
            }}
        />
    </Section>

    {#if scalingMode}
        <Section heading="Increment Configuration" hint={getHint()}>
            {#if scalingMode !== "cantrip"}
                <div class="a5e-scaling-dialog__config">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        name="system.{propertyKey}.step"
                        id="system.{propertyKey}.step"
                        value={scaling.step ?? 1}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                parseInt(currentTarget.value, 10),
                            )}
                    />

                    <label
                        for="system.{propertyKey}.step"
                        class="a5e-scaling-dialog__label"
                    >
                        Per
                    </label>
                </div>
            {/if}

            <!-- For Roll Types -->
            {#if scalingType === "roll"}
                <div class="a5e-scaling-dialog__config">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        name="system.{propertyKey}.config.number"
                        id="system.{propertyKey}.config.number"
                        value={scaling.config.number ?? 0}
                        onchange={({ currentTarget }) => {
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                currentTarget.value,
                            );
                        }}
                    />

                    <label
                        for="system.{propertyKey}.config.number"
                        class="a5e-scaling-dialog__label"
                    >
                        Dice Count
                    </label>
                </div>

                <div class="a5e-scaling-dialog__config">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        name="system.{propertyKey}.config.denom"
                        id="system.{propertyKey}.config.denom"
                        value={scaling.config.denom ?? 0}
                        onchange={({ currentTarget }) => {
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                currentTarget.value,
                            );
                        }}
                    />

                    <label
                        for="system.{propertyKey}.config.denom"
                        class="a5e-scaling-dialog__label"
                    >
                        Dice Denomination
                    </label>
                </div>
            {/if}

            <div></div>

            <!-- Default Types -->
            <div
                class="a5e-scaling-dialog__config a5e-scaling-dialog__config--long"
            >
                <label
                    for="system.{propertyKey}.config.value"
                    class="a5e-scaling-dialog__label"
                >
                    Bonus Increment
                </label>

                <input
                    class="a5e-input a5e-input--slim"
                    type="text"
                    name="system.{propertyKey}.config.value"
                    id="system.{propertyKey}.config.value"
                    value={scaling.config.value ?? ""}
                    onchange={({ currentTarget }) => {
                        updateDocumentDataFromField(
                            item,
                            currentTarget.name,
                            currentTarget.value,
                        );
                    }}
                />
            </div>
        </Section>
    {/if}
</form>

<style lang="scss">
</style>
