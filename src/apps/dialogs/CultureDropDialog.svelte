<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";
    import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store";
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
    <section class="section-wrapper">
        <h3>
            {localize("A5E.BackgroundDropLanguagesSelect")}
        </h3>
    </section>

    <CustomTagGroup
        options={Object.entries(A5E.languages)}
        selected={languages.fixed}
        disabled={selectedLanguages.length >= languages.count}
        red={$actor.system.proficiencies.languages}
        on:updateSelection={({ detail }) => (selectedLanguages = detail)}
    />

    <div>
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
        gap: 1rem;
        overflow: auto;

        h3 {
            font-size: 0.833rem;
            font-weight: bold;
            font-family: "Signika", sans-serif;
        }
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: 0.694rem;
        width: 100%;
    }

    .section-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .button-container {
        display: flex;
    }

    .tools-config {
        font-size: 0.694rem;
        margin-left: auto;
        margin-right: 0.75rem;
    }

    .hint {
        font-family: "Signika", sans-serif;
        font-size: 0.694rem;
    }
</style>
