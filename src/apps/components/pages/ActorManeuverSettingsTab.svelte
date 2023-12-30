<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import determineIfPropertyModifiedByEffect from "../../../utils/determineIfPropertyModifiedByEffect ";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: disableManeuverDC = determineIfPropertyModifiedByEffect(
        $actor,
        "system.bonuses.maneuverDC",
    );
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    {#if $actor.type === "character"}
        <div class="a5e-section a5e-section--settings">
            <header class="a5e-section-header a5e-section-header--rounded">
                <h3 class="a5e-section-header__heading">
                    Maneuver Resource Settings
                </h3>
            </header>

            <FormSection --background="transparent" --padding="0.25rem">
                <Checkbox
                    label="A5E.ExertionRecoveryConfigPrompt"
                    checked={$actor.system.attributes.exertion.recoverOnRest}
                    on:updateSelection={({ detail }) => {
                        updateDocumentDataFromField(
                            $actor,
                            "system.attributes.exertion.recoverOnRest",
                            detail,
                        );
                    }}
                />
            </FormSection>
        </div>
    {/if}

    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header a5e-section-header--rounded">
            <h3 class="a5e-section-header__heading">
                Miscellaneous Maneuver Settings
            </h3>
        </header>

        <FormSection
            heading="A5E.ManeuverDCBonus"
            hint="This field accepts any values valid in roll formulae."
            showWarning={disableManeuverDC}
            warning="A5E.validations.warnings.modifiedByEffect"
            --background="transparent"
            --padding="0.25rem"
        >
            <input
                class="a5e-input"
                type="text"
                name="system.bonuses.maneuverDC"
                value={$actor.system.bonuses.maneuverDC}
                disabled={disableManeuverDC}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value,
                    )}
            />
        </FormSection>
    </div>
</section>
