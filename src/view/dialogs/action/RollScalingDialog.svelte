<script lang="ts">
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        document: any;
        actionId: string;
        rollId: string;
    };

    function getScalingOptions() {
        return [
            [null, "A5E.None"],
            ...Object.entries(CONFIG.A5E.baseScalingModes),
        ] as [string, string][];
    }

    let { document, actionId, rollId }: Props = $props();

    let item = document;

    let roll = $derived(item.reactive.actions.get(actionId)?.rolls[rollId]);
    let scalingMode = $derived(roll.scaling?.mode ?? null);
</script>

<form class="a5e-scaling-dialog">
    <RadioGroup
        heading="Scaling Mode"
        options={getScalingOptions()}
        selected={scalingMode}
        allowDeselect={false}
        onUpdateSelection={(detail) => {
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.rolls.${rollId}.scaling.mode`,
                detail,
            );
        }}
    />

    {#if scalingMode === "cantrip"}
        <FieldWrapper
            heading="Roll Increment"
            hint="This increment will be applied automatically to your roll based on your caster level."
        >
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                value={roll.scaling?.formula ?? 0}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        currentTarget.name,
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>
    {:else if scalingMode === "spellLevel"}
        <FieldWrapper
            hint="This increment will be applied automatically to your roll based on the spell level used during activation."
        >
            <section class="a5e-scaling-dialog__section">
                <FieldWrapper heading="Roll Increment">
                    <input
                        class="a5e-input a5e-input--slim"
                        id="{actionId}-{rollId}-roll-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                currentTarget.value,
                            )}
                    />
                </FieldWrapper>

                <FieldWrapper heading="Per">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        id="{actionId}-{rollId}-roll-scaling-step"
                        type="number"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.step"
                        value={roll.scaling?.step ?? 1}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                parseInt(currentTarget.value, 10),
                            )}
                    />
                </FieldWrapper>
            </section>
        </FieldWrapper>
    {:else if ["artifactCharges", "spellPoints", "actionUses", "itemUses"].includes(scalingMode)}
        <FieldWrapper>
            <section class="a5e-scaling-dialog__section">
                <FieldWrapper heading="Roll Increment">
                    <input
                        class="a5e-input a5e-input--slim"
                        id="{actionId}-{rollId}-roll-scaling-formula"
                        type="text"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.formula"
                        value={roll.scaling?.formula ?? 0}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                currentTarget.value,
                            )}
                    />
                </FieldWrapper>

                <FieldWrapper heading="Per">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        id="{actionId}-{rollId}-roll-scaling-step"
                        style="text-align: center;"
                        type="number"
                        name="system.actions.{actionId}.rolls.{rollId}.scaling.step"
                        value={roll.scaling?.step ?? 1}
                        onchange={({ currentTarget }) =>
                            updateDocumentDataFromField(
                                item,
                                currentTarget.name,
                                parseInt(currentTarget.value, 10),
                            )}
                    />
                </FieldWrapper>
            </section>
        </FieldWrapper>
    {/if}
</form>
