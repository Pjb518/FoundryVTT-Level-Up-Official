<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import Section from "../Section.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    const globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight",
    );

    $: flags = $actor.flags?.a5e ?? {};
</script>

<Section heading="Weight Tracking Options" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.settings.trackInventoryWeight"
            checked={flags?.trackInventoryWeight ?? true}
            on:updateSelection={({ detail }) => {
                updateDocumentDataFromField(
                    $actor,
                    "flags.a5e.trackInventoryWeight",
                    detail,
                );
            }}
        />
    </FieldWrapper>

    {#if flags?.trackInventoryWeight ?? true}
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.doubleCarryingCapacity"
                checked={flags?.doubleCarryCapacity ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.doubleCarryCapacity",
                        detail,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.trackCurrencyWeight">
            <Checkbox
                label="A5E.settings.trackCurrencyWeight"
                checked={flags?.trackCurrencyWeight ??
                    globalCurrencyWeightTrackingSelection}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.trackCurrencyWeight",
                        detail,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>
