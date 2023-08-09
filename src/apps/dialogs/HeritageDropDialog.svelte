<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    export let { application } = getContext("#external");
    export let { actorDocument, itemDocument } =
        getContext("#external").application;

    const actor = new TJSDocument(actorDocument);
    const item = new TJSDocument(itemDocument);

    function submitForm() {
        application.submit({});
    }

    let selectedGiftCategory = "";
    let selectedFeatures = [];

    $: gifts = Object.values($item.system.gifts).reduce((acc, gift) => {
        if (gift.category === selectedGiftCategory) acc.push(gift.uuid);
        return acc;
    }, []);

    $: features = Object.values($item.system.features).map((f) => {
        const data = fromUuidSync(f.uuid);
        return [f.uuid, data.name];
    });
    $: giftCategories = Object.entries($item.system.giftCategories);
</script>

<form>
    <section>
        <FormSection heading={localize("A5E.originSheets.heritage.features")}>
            <CheckboxGroup
                options={features}
                selected={selectedFeatures}
                on:updateSelection={({ detail }) => (selectedFeatures = detail)}
            />
        </FormSection>

        <FormSection heading={localize("A5E.originSheets.heritage.gifts")}>
            <RadioGroup
                options={giftCategories}
                selected={selectedGiftCategory}
                on:updateSelection={({ detail }) =>
                    (selectedGiftCategory = detail)}
            />
        </FormSection>
    </section>

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
        height: min(90vh, 25rem);
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    .button-container {
        display: flex;
    }
</style>
