<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import FormSection from "../components/FormSection.svelte";
    import CustomTagGroup from "../components/CustomTagGroup.svelte";

    export let { application } = getContext("#external");
    export let { actorDocument, itemDocument } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    const { A5E } = CONFIG;

    function submitForm() {
        application.submit({
            selectedLanguages,
        });
    }

    $: languages = $item.system.proficiencies.languages;
    $: selectedLanguages = [...languages.fixed];
</script>

<form>
    <FormSection
        heading="A5E.BackgroundDropLanguagesSelect"
        warning="{languages.count -
            selectedLanguages.length} language selections remaining"
        showWarning={selectedLanguages.length < languages.count}
    >
        <CustomTagGroup
            options={Object.entries(A5E.languages)}
            selected={languages.fixed}
            disabled={selectedLanguages.length >= languages.count}
            red={$actor.system.proficiencies.languages}
            on:updateSelection={({ detail }) => (selectedLanguages = detail)}
        />
    </FormSection>

    <div class="button-container">
        <button on:click|preventDefault={submitForm}>
            {localize("A5E.Submit")}
        </button>
    </div>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
    }

    .button-container {
        display: flex;
    }
</style>
