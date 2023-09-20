<script>
    import { getContext, setContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import CheckboxGroup from "../CheckboxGroup.svelte";
    import ChangeConfiguration from "../effectChanges/ChangeConfiguration.svelte";
    import ChangeValue from "../effectChanges/ChangeValue.svelte";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    const item = getContext("item");
    const allOptions = game.a5e.activeEffects.options.all.allOptions;
    const optionsList = {};
    Object.entries(allOptions ?? {}).forEach(([key, value]) => {
        if (
            key.startsWith("system.attributes.movement") ||
            key.startsWith("system.attributes.senses")
        ) {
            optionsList[key] = value;
            return;
        }
    });

    function addChange() {
        const change = {
            key: "",
            mode: null,
            value: "",
            priority: null,
        };

        changes = [...changes, change];

        traitEffect.update({ changes });
    }

    function deleteChange(id) {
        changes = changes.filter((_, idx) => idx !== id);
        traitEffect.update({ changes });
    }

    function updateChange(idx, key, value) {
        changes[idx] ??= {};
        changes[idx][key] = value;

        // Change mode and reset value if key has changed
        if (key === "key") {
            changes[idx]["value"] = "";
            changes[idx]["mode"] =
                MODES[optionsList[changes[idx]?.key]?.modes?.[0]] ?? null;
        }

        // Update Document
        traitEffect.update({ changes });
    }

    const creatureSizes = Object.entries(CONFIG.A5E.actorSizes);
    const creatureTypes = Object.entries(CONFIG.A5E.creatureTypes);

    let effects = $item.effects;
    const traitEffect =
        effects.find(
            (effect) => effect.name === "Movement & Senses Configuration"
        ) ?? "No trait effect found. Please re-create the item.";

    /** @type {Array<Object>}*/
    $: changes = traitEffect?.changes ?? [];
    setContext("effect", new TJSDocument(traitEffect));
    console.log(traitEffect.changes);
</script>

<article>
    <FormSection --direction="column" --gap="0.75rem">
        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">Size Category</h3>

            <RadioGroup
                options={creatureSizes}
                selected={$item.system.creatureSize.fixed}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.creatureSize.fixed",
                        detail
                    )}
            />
        </section>

        <section class="u-flex u-flex-col u-gap-sm">
            <h3 class="u-text-bold u-text-sm">Optional Size Choices</h3>

            <CheckboxGroup
                options={creatureSizes}
                selected={$item.system.creatureSize.options}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.creatureSize.options",
                        detail
                    )}
            />
        </section>
    </FormSection>

    <FormSection heading="A5E.CreatureTypesLabel">
        <CheckboxGroup
            options={creatureTypes}
            selected={$item.system.creatureTypes}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.creatureTypes",
                    detail
                )}
        />
    </FormSection>

    {#if typeof traitEffect === "string"}
        {traitEffect}
    {:else}
        <FormSection
            heading="Movement & Senses Configuration"
            --direction="column"
        >
            <button
                class="a5e-button a5e-button--add add-button fas fa-plus"
                on:click|preventDefault|stopPropagation={addChange}
            />

            <section class="changes-list">
                {#each changes as { key, value, mode }, idx (idx)}
                    <div class="change-container">
                        <div class="button-wrapper">
                            <button
                                class="a5e-button a5e-button--delete fas fa-trash"
                                style="font-size: $font-size-md;"
                                on:click={() => deleteChange(idx)}
                            />
                        </div>

                        <div class="row" style="padding-right: 2rem;">
                            <ChangeConfiguration
                                {idx}
                                {key}
                                {optionsList}
                                on:changeKey={({ detail }) =>
                                    updateChange(idx, "key", detail)}
                                on:changePriority={({ detail }) =>
                                    updateChange(idx, "priority", detail)}
                                on:changeMode={({ detail }) =>
                                    updateChange(idx, "mode", detail)}
                            />
                        </div>

                        <ChangeValue
                            {key}
                            {value}
                            {mode}
                            {optionsList}
                            on:change={({ detail }) =>
                                updateChange(idx, "value", detail)}
                        />
                    </div>
                {/each}
            </section>
        </FormSection>
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 1rem;
        overflow-y: auto;
    }

    .button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        color: #999;
        font-size: $font-size-md;
    }

    .changes-list {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 0.75rem;
        position: relative;
        padding: 0;
        margin: 0;
    }

    .change-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        position: relative;
        width: 100%;
        padding: 0.75rem;
        font-size: $font-size-sm;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }

    .row {
        display: flex;
        gap: 0.75rem;
        width: 100%;
    }

    .add-button {
        position: absolute;
        right: 0.75rem;
        top: 0.75rem;
        color: #999;
        transition: $standard-transition;

        &:hover,
        &:focus {
            color: #555;
            outline: none;
            text-shadow: none;
            transform: scale(1.1);
        }
    }
</style>
