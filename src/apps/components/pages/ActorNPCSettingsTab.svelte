<script>
    import { getContext } from "svelte";

    import Checkbox from "../Checkbox.svelte";
    import FormSection from "../LegacyFormSection.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: flags = $actor.flags;
</script>

<section class="a5e-page-wrapper a5e-page-wrapper--settings">
    <div class="a5e-section a5e-section--settings">
        <header class="a5e-section-header">
            <h3 class="a5e-section-header__heading">Token Options</h3>
        </header>

        <FormSection --background="rgba(255, 255, 255, 0.1)" --gap="0.25rem">
            <Checkbox
                label="Disable Randomized HP Rolls"
                checked={flags.a5e?.disableRandomizedHP ?? false}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $actor,
                        "flags.a5e.disableRandomizedHP",
                        detail,
                    );
                }}
            />
        </FormSection>
    </div>
</section>
