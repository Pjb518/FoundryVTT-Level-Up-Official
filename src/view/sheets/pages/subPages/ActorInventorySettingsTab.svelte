<script lang="ts">
    import { getContext } from "svelte";

    import Checkbox from "#view/snippets/Checkbox.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Section from "#view/snippets/Section.svelte";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let flags = $derived(actor.reactive.flags?.a5e ?? {});

    let globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight",
    );
</script>

<Section heading="Weight Column Options" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.settings.showWeightColumn"
            checked={flags?.showWeightColumn ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(actor, "flags.a5e.showWeightColumn", checked);
            }}
        />
    </FieldWrapper>
</Section>

<Section heading="Weight Tracking Options" --a5e-section-body-gap="0.75rem">
    <FieldWrapper>
        <Checkbox
            label="A5E.settings.trackInventoryWeight"
            checked={flags?.trackInventoryWeight ?? true}
            onUpdateSelection={(checked) => {
                updateDocumentDataFromField(
                    actor,
                    "flags.a5e.trackInventoryWeight",
                    checked,
                );
            }}
        />
    </FieldWrapper>

    {#if flags?.trackInventoryWeight ?? true}
        <FieldWrapper>
            <Checkbox
                label="A5E.settings.doubleCarryingCapacity"
                checked={flags?.doubleCarryCapacity ?? false}
                onUpdateSelection={(checked) => {
                    updateDocumentDataFromField(
                        actor,
                        "flags.a5e.doubleCarryCapacity",
                        checked,
                    );
                }}
            />
        </FieldWrapper>

        <FieldWrapper hint="A5E.settings.hints.trackCurrencyWeight">
            <Checkbox
                label="A5E.settings.trackCurrencyWeight"
                checked={flags?.trackCurrencyWeight ??
                    globalCurrencyWeightTrackingSelection}
                onUpdateSelection={(checked) => {
                    updateDocumentDataFromField(
                        actor,
                        "flags.a5e.trackCurrencyWeight",
                        checked,
                    );
                }}
            />
        </FieldWrapper>
    {/if}
</Section>
