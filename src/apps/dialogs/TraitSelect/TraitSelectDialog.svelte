<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let traitGroups;
    export let selected;
    export let disabled;
    export let selectionLimit;

    // We generate a list of disabled custom traits in order to remove them from the custom
    // text box. This ensures these traits can not be edited. However we must still check that
    // they won't be added either.
    let _disabledCustom = disabled.filter((trait) => isCustomTrait(trait));
    let _disabledSelected = selected.filter((trait) =>
        _disabledCustom.includes(trait)
    );

    // We add selected length to the selectionLimit, since selectionLimit limits how many more
    // elements we can add to selected. This simplifies the logic of deselecting an element and
    // adding a different element. Since now all we have to test for is
    // that selected.length == selectionLimit.
    if (typeof selectionLimit === "number") {
        selectionLimit += selected.length;
    }

    const application = getContext("external").application;

    function isCustomTrait(trait) {
        for (let group of traitGroups) {
            if (!group.traits) continue;

            for (let definedTrait in group.traits) {
                if (definedTrait === trait) return false;
            }
        }

        return true;
    }

    function isDisabled(trait) {
        // Disable all nonchecked, check marks if we've reached selectionLimit
        if (
            selectionLimit &&
            selected.length >= selectionLimit &&
            !selected.includes(trait)
        ) {
            return true;
        }

        return disabled.includes(trait);
    }

    function setTrait(trait, status) {
        if (status) {
            selected = [...selected, trait];
        } else {
            selected.findSplice((selected) => selected === trait);
        }

        // Prevent duplicate values
        selected = [...new Set(selected)];
        updateDisabledStatus();
    }

    function getCustom() {
        const custom = selected.filter(
            (trait) => isCustomTrait(trait) && !_disabledCustom.includes(trait)
        );

        return custom.join(";");
    }

    function setCustom(element) {
        // Split, trim, remove empty & disabled
        const customList = element.value
            .split(";")
            .map((i) => i.trim())
            .filter((i) => i && !_disabledCustom.includes(i));

        selected = selected
            // Remove all custom from selected
            .filter((trait) => !isCustomTrait(trait))
            // Add back disabled selected (our input box doesn't control these)
            .concat(_disabledSelected);

        // Test to ensure that the custom added selection isn't going to exceed the limit.
        if (selectionLimit) {
            // Calculate how much we're over the limit by.
            const overLimit =
                selected.length + customList.length - selectionLimit;

            // Warn the user and truncate the customList
            if (overLimit > 0) {
                ui.notifications.warn(
                    "You have added too many custom traits, we will remove the extra for you"
                );
                customList.splice(-overLimit);
            }
        }

        // Add the custom traits to the selected and update
        selected = [...selected, ...customList];
        element.value = getCustom();
        updateDisabledStatus();
    }

    function submitForm() {
        application.submit(selected);
    }

    // Updates the disabled/checked values. Since any checkbox can modifiy the disabled state of any
    // Due to the selectionLimit, we must maintain the list of _disabled elemets seperately so that
    // Svelte knows to update those elements.
    let _disabled = {};
    let _disableSubmit = false;
    function updateDisabledStatus() {
        for (let group of traitGroups) {
            for (let trait in group.traits ?? {}) {
                _disabled[trait] = isDisabled(trait);
            }
        }

        _disableSubmit = selectionLimit && selected.length !== selectionLimit;
    }
    updateDisabledStatus();
</script>

<form>
    {#each traitGroups as group}
        {#if group.traits}
            <section class="trait-list">
                <h3>{localize(group.label)}</h3>
                <div class="container">
                    {#each Object.entries(group.traits) as [trait, label] (trait)}
                        <input
                            type="checkbox"
                            id="trait-{trait}"
                            checked={selected.includes(trait)}
                            disabled={_disabled[trait]}
                            value={trait}
                            on:change={({ target }) => {
                                setTrait(trait, target.checked);
                            }}
                        />

                        <label for={`trait-${trait}`}>
                            {localize(label)}
                        </label>
                    {/each}
                </div>
            </section>
        {:else}
            <h3>{localize(group.label)}</h3>
            <input
                class="a5e-input"
                type="text"
                name="custom-traits"
                value={getCustom()}
                on:change={({ target }) => setCustom(target)}
            />

            <p class="hint">{localize("A5E.HintSeparateBySemiColon")}</p>
        {/if}
    {/each}

    <div class="button-container">
        <button disabled={_disableSubmit} on:click|preventDefault={submitForm}
            >Submit</button
        >
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
    }

    h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid gray;
    }

    .trait-list {
        .container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.2rem;
        }

        input {
            display: none;

            &:checked + label {
                background: #2b6537;
                border-color: darken($color: #2b6537, $amount: 5);
                color: #f6f2eb;
            }

            &:disabled + label {
                color: #999;
            }
        }

        label {
            border-radius: 3px;
            border: 1px solid #bbb;
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }
    }

    .button-container {
        display: flex;
    }
</style>
