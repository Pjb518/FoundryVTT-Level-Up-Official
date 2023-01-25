<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    import FormSection from "../components/FormSection.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import updateDocumentDataFromField from "../utils/updateDocumentDataFromField";

    export let { actor, source, appId } = getContext("external").application;

    const recoveryOptions = Object.entries(CONFIG.A5E.resourceRecoveryOptions);
    $: resource = $actor.system.resources[source];
</script>

<main>
    <header class="u-px-lg u-py-xl">
        <h1 class="u-font-serif u-text-xl">
            {localize("A5E.ResourceConfigurationTitle")}
        </h1>
    </header>

    <div class="u-flex u-flex-col u-gap-md">
        <FormSection>
            <div class="u-flex u-gap-md u-align-center">
                <input
                    class="a5e-input"
                    type="checkbox"
                    id={`${appId}-resources-${source}-hideMax`}
                    name={`system.resources.${source}.hideMax`}
                    checked={resource.hideMax ?? false}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.checked
                        )}
                />

                <label
                    class="u-pointer u-text-bold u-text-sm"
                    for={`${appId}-resources-${source}-hideMax`}
                >
                    {localize("A5E.GenericResourceHideMax")}
                </label>
            </div>
        </FormSection>

        <FormSection heading="A5E.RecoverResourceAt">
            <RadioGroup
                options={recoveryOptions}
                selected={resource.per}
                name={`system.resources.${source}.per`}
                document={actor}
            />
        </FormSection>
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.75rem;
        gap: 0.5rem;
        overflow: auto;
        background: rgba(246, 242, 235, 0.5);
    }
</style>
