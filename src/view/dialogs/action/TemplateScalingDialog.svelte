<script lang="ts">
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import TemplatePreparationManager from "#managers/TemplatePreparationManager.js";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        document: any;
        actionId: string;
    };

    function getScalingOptions() {
        return [
            [null, "A5E.None"],
            ...Object.entries(CONFIG.A5E.targetScalingModes),
        ] as [string, string][];
    }

    let { document, actionId }: Props = $props();

    let item = document;

    let action = $derived(item.reactive.actions.get(actionId));
    let area = $derived(action.area ?? {});
    let scalingMode = $derived(area?.scaling?.mode ?? null);

    let properties = $derived([
        "quantity",
        ...TemplatePreparationManager.getShapeProperties(area?.shape),
    ]);
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
                `system.actions.${actionId}.area.scaling.mode`,
                detail,
            );
        }}
    />

    {#if scalingMode === "cantrip"}
        <FieldWrapper
            hint="This increment will be applied automatically based on your caster level."
        >
            <section class="a5e-scaling-dialog__section">
                {#each properties as property}
                    <FieldWrapper heading="{property.capitalize()} Increment">
                        <input
                            class="a5e-input a5e-input--slim"
                            type="text"
                            name="system.actions.{actionId}.area.scaling.formula.{property}"
                            value={action.area.scaling?.formula?.[property] ??
                                0}
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    item,
                                    currentTarget.name,
                                    currentTarget.value,
                                )}
                        />
                    </FieldWrapper>
                {/each}
            </section>
        </FieldWrapper>
    {:else if scalingMode === "spellLevel"}
        <FieldWrapper>
            <section class="a5e-scaling-dialog__section">
                {#each properties as property}
                    <FieldWrapper heading="{property.capitalize()} Increment">
                        <input
                            class="a5e-input a5e-input--slim"
                            type="text"
                            name="system.actions.{actionId}.area.scaling.formula.{property}"
                            value={area?.scaling?.formula?.[property] ?? 0}
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    item,
                                    currentTarget.name,
                                    currentTarget.value,
                                )}
                        />
                    </FieldWrapper>
                {/each}

                <FieldWrapper heading="Per">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        name="system.actions.{actionId}.area.scaling.step"
                        value={area?.scaling?.step ?? 1}
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
                {#each properties as property}
                    <FieldWrapper heading="{property.capitalize()} Increment">
                        <input
                            class="a5e-input a5e-input--slim"
                            type="text"
                            name="system.actions.{actionId}.area.scaling.formula.{property}"
                            value={area?.scaling?.formula?.[property] ?? 0}
                            onchange={({ currentTarget }) =>
                                updateDocumentDataFromField(
                                    item,
                                    currentTarget.name,
                                    currentTarget.value,
                                )}
                        />
                    </FieldWrapper>
                {/each}

                <FieldWrapper heading="Per">
                    <input
                        class="a5e-input a5e-input--slim a5e-input--small"
                        type="number"
                        name="system.actions.{actionId}.area.scaling.step"
                        value={area?.scaling?.step ?? 1}
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
