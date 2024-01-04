<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    const globalCurrencyWeightTrackingSelection = game.settings.get(
        "a5e",
        "currencyWeight",
    );

    $: flags = $actor.flags?.a5e ?? {};
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Weight Tracking Options</h3>
        </header>

        <FormSection --background="transparent" --padding="0.25rem">
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
        </FormSection>

        {#if flags?.trackInventoryWeight ?? true}
            <FormSection --background="transparent" --padding="0.25rem">
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
            </FormSection>

            <FormSection
                hint="A5E.settings.hints.trackCurrencyWeight"
                --background="transparent"
                --padding="0.25rem"
                --gap="0.25rem"
            >
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
            </FormSection>
        {/if}
    </div>
</section>
