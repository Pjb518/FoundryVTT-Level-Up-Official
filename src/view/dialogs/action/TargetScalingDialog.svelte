<script lang="ts">
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        document: any;
        actionId: string;
    };

    function getTargetScalingOptions() {
        return [
            [null, "A5E.None"],
            ...Object.entries(CONFIG.A5E.targetScalingModes),
        ] as [string, string][];
    }

    let { document, actionId }: Props = $props();

    let item = document;

    let action = $derived(item.reactive.actions.get(actionId));
    let target = $derived(action.target ?? {});
    let scalingMode = $derived(target?.scaling?.mode ?? null);
</script>

<form class="a5e-scaling-dialog">
    <RadioGroup
        heading="Scaling Mode"
        options={getTargetScalingOptions()}
        selected={scalingMode}
        allowDeselect={false}
        onUpdateSelection={(detail) => {
            updateDocumentDataFromField(
                item,
                `system.actions.${actionId}.target.scaling.mode`,
                detail,
            );
        }}
    />

    {#if scalingMode === "cantrip"}
        <FieldWrapper
            heading="Targets Increment"
            hint="This increment will be applied automatically based on your caster level."
        >
            <input
                class="a5e-input a5e-input--slim"
                type="text"
                name="system.actions.{actionId}.target.scaling.formula"
                value={action.target.scaling?.formula ?? 0}
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        item,
                        currentTarget.name,
                        currentTarget.value,
                    )}
            />
        </FieldWrapper>
    {:else if scalingMode === "spellLevel"}
        <FieldWrapper>
            <section class="a5e-scaling-dialog__section">
                <FieldWrapper heading="Targets Increment">
                    <input
                        class="a5e-input a5e-input--slim"
                        type="text"
                        name="system.actions.{actionId}.target.scaling.formula"
                        value={target?.scaling?.formula ?? 0}
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
                        type="number"
                        name="system.actions.{actionId}.target.scaling.step"
                        value={target?.scaling?.step ?? 1}
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
                <FieldWrapper heading="Targets Increment">
                    <input
                        class="a5e-input a5e-input--slim"
                        type="text"
                        name="system.actions.{actionId}.target.scaling.formula"
                        value={target?.scaling?.formula ?? 0}
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
                        type="number"
                        name="system.actions.{actionId}.target.scaling.step"
                        value={target?.scaling?.step ?? 1}
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
