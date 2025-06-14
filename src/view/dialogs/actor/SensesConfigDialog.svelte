<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        document: any;
    };

    let { document }: Props = $props();

    const actor = document;
    const { A5E } = CONFIG;

    const headings = {
        blindsight: "A5E.senses.ranges.blindsight",
        darkvision: "A5E.senses.ranges.darkvision",
        tremorsense: "A5E.senses.ranges.tremorsense",
        truesight: "A5E.senses.ranges.truesight",
    };

    let senses = $derived(
        Object.entries(actor.reactive._source.system.attributes.senses),
    ) as [string, any][];
</script>

<article>
    {#each senses as [sense, senseData]}
        <FieldWrapper
            heading={headings[sense]}
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-background="rgba(0, 0, 0, 0.05)"
            --a5e-field-wrapper-padding="0.5rem"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-label-width="7.5rem"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                disabled={senseData.unit === "unlimited"}
                type={senseData.unit === "unlimited" ? "text" : "number"}
                name="system.attributes.senses.{sense}.distance"
                min="0"
                value={senseData.unit === "unlimited"
                    ? "—"
                    : senseData.distance || 0}
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
                name="system.attributes.senses.{sense}.unit"
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        actor,
                        currentTarget.name,
                        currentTarget.value,
                    )}
            >
                {#each Object.entries(A5E.visionUnits) as [key, name]}
                    <option
                        {key}
                        value={key}
                        selected={actor.system.attributes.senses[sense].unit ===
                            key}
                    >
                        {localize(name as string)}
                    </option>
                {/each}
            </select>

            {#if sense === "blindsight"}
                <Checkbox
                    label="Blind Beyond this Range"
                    checked={actor.system.attributes.senses.blindsight
                        ?.otherwiseBlind}
                    onUpdateSelection={(value) =>
                        updateDocumentDataFromField(
                            actor,
                            "system.attributes.senses.blindsight.otherwiseBlind",
                            value,
                        )}
                />
            {/if}
        </FieldWrapper>
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
