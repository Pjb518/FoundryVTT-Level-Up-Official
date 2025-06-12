<script>
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    export let document;
    export let appId;

    const actor = document;
    const { A5E } = CONFIG;

    const headings = {
        blindsight: "A5E.senses.ranges.blindsight",
        darkvision: "A5E.senses.ranges.darkvision",
        tremorsense: "A5E.senses.ranges.tremorsense",
        truesight: "A5E.senses.ranges.truesight",
    };
</script>

<article>
    {#each Object.entries($actor._source.system.attributes.senses) as [sense, senseData]}
        <FieldWrapper
            heading={headings[sense]}
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-background="rgba(0, 0, 0, 0.05)"
            --a5e-field-wrapper-padding="0.5rem"
            --a5e-field-wrapper-item-alignment="center"
            --a5e-field-wrapper-label-width="7.5rem"
        >
            <div class="u-w-20">
                <input
                    class="a5e-input"
                    disabled={senseData.unit === "unlimited"}
                    type={senseData.unit === "unlimited" ? "text" : "number"}
                    name="system.attributes.senses.{sense}.distance"
                    min="0"
                    value={senseData.unit === "unlimited"
                        ? "—"
                        : senseData.distance || 0}
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Math.max(Number(target.value), 0),
                        );
                    }}
                />
            </div>

            <select
                class="u-w-30"
                name="system.attributes.senses.{sense}.unit"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value,
                    )}
            >
                {#each Object.entries(A5E.visionUnits) as [key, name]}
                    <option
                        {key}
                        value={key}
                        selected={$actor.system.attributes.senses[sense]
                            .unit === key}
                    >
                        {localize(name)}
                    </option>
                {/each}
            </select>

            {#if sense === "blindsight"}
                <Checkbox
                    label="Blind Beyond this Range"
                    checked={$actor.system.attributes.senses.blindsight
                        ?.otherwiseBlind}
                    on:updateSelection={({ detail }) =>
                        updateDocumentDataFromField(
                            $actor,
                            "system.attributes.senses.blindsight.otherwiseBlind",
                            detail,
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
