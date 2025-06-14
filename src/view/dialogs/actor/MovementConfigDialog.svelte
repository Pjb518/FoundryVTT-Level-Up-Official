<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        document: Actor;
    };

    let { document }: Props = $props();
    const { A5E } = CONFIG;
    const actor = document;

    const headings = {
        burrow: "A5E.details.movement.types.burrow",
        climb: "A5E.details.movement.types.climb",
        fly: "A5E.details.movement.types.fly",
        swim: "A5E.details.movement.types.swim",
        walk: "A5E.details.movement.types.walk",
    };

    let movement = $derived(
        Object.entries(actor.reactive._source.system.attributes.movement ?? {}),
    ) as [string, any][];
</script>

<article>
    {#each movement as [mode, movementData]}
        {#if mode != "traits"}
            <FieldWrapper
                heading={headings[mode]}
                --a5e-field-wrapper-direction="row"
                --a5e-field-wrapper-background="rgba(0, 0, 0, 0.05)"
                --a5e-field-wrapper-padding="0.5rem"
                --a5e-field-wrapper-item-alignment="center"
                --a5e-field-wrapper-label-width="7.5rem"
            >
                <input
                    class="a5e-input a5e-input--slim a5e-input--small"
                    type="number"
                    name="system.attributes.movement.{mode}.distance"
                    value={movementData.distance || 0}
                    min="0"
                    onchange={({ currentTarget }) => {
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            Math.max(Number(currentTarget.value), 0),
                        );
                    }}
                />

                <select
                    class="a5e-input a5e-input--slim a5e-input--fit"
                    name={`system.attributes.movement.${mode}.unit`}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            currentTarget.value,
                        )}
                >
                    {#each Object.entries(A5E.distanceUnits) as [key, name]}
                        <option
                            {key}
                            value={key}
                            selected={movementData.unit === key}
                        >
                            {localize(name)}
                        </option>
                    {/each}
                </select>

                {#if mode === "fly"}
                    <Checkbox
                        label="A5E.details.movement.hover"
                        checked={movementData?.hover}
                        onUpdateSelection={(value) => {
                            updateDocumentDataFromField(
                                actor,
                                "system.attributes.movement.traits.hover",
                                value,
                            );
                        }}
                    />
                {/if}
            </FieldWrapper>
        {/if}
    {/each}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
    }
</style>
