<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../FormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
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
</section>
