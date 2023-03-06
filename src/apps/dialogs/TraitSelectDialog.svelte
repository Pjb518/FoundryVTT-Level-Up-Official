<svelte:options accessors={true} />

<script>
    import { getContext } from "svelte";
    import { localize } from "@typhonjs-fvtt/runtime/svelte/helper";

    export let traitGroups;
    export let selected;
    export let disabled;
    export let selectionLimit;

    const { application } = getContext("#external");
    const randomId = foundry.utils.randomID();

    // We generate a list of disabled selected traits, since we remove disabled traits from the
    // custom input box, we must keep track them seperately.
    let _disabledCustomSelectedTraits = selected.filter(
        (trait) => isCustomTrait(trait) && disabled.includes(trait)
    );

    // We track disabledTags and disabledSumbit with variables so svelte can detect changes
    // updateDisabledStatus()
    let _disabledTags = {};
    let _disableSubmit = false;

    // Sets the initial disable status
    updateDisabledStatus();

    function isCustomTrait(trait) {
        return !traitGroups
            .flatMap(({ traits }) => Object.keys(traits ?? {}))
            .includes(trait);
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

    function getCustomTrait() {
        const custom = selected.filter(
            (trait) => isCustomTrait(trait) && !disabled.includes(trait)
        );

        return custom.join(";");
    }

    function setCustomTrait(element) {
        // Split, trim, remove empty & disabled
        const customList = element.value
            .split(";")
            .map((i) => i.trim())
            .filter((i) => i && !disabled.includes(i));

        selected = selected
            // Remove all custom from selected
            .filter((trait) => !isCustomTrait(trait))
            // Add back disabled selected (our input box doesn't control these)
            .concat(_disabledCustomSelectedTraits);

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
        element.value = getCustomTrait();
        updateDisabledStatus();
    }

    function submitForm() {
        application.submit(selected);
    }

    // Updates the disabled/checked values. Since any checkbox can modifiy the disabled state of any
    // Due to the selectionLimit, we must maintain the list of _disabled elemets seperately so that
    // Svelte knows to update those elements.
    function updateDisabledStatus() {
        for (const group of traitGroups) {
            for (const trait in group.traits ?? {}) {
                _disabledTags[trait] = isDisabled(trait);
            }
        }

        _disableSubmit = selectionLimit && selected.length !== selectionLimit;
    }

    function hasSelectedDisabled() {
        return (
            disabled.find((disabledTrait) =>
                selected.includes(disabledTrait)
            ) !== undefined
        );
    }

    function getSelectedDisabledNames() {
        const selectedDisabledGroupTraits = disabled
            .filter((disabledTrait) => selected.includes(disabledTrait))
            .map((trait) => {
                const group = traitGroups.find((group) =>
                    group.traits?.hasOwnProperty(trait)
                );
                return localize(group ? group.traits[trait] : trait);
            });

        return selectedDisabledGroupTraits.join(", ");
    }

    function getSelectionRemainingHint(number) {
        const RemainingRemove = number > 0 ? "Remaining" : "Remove";
        const SingularPlural = Math.abs(number) === 1 ? "" : "Plural";
        return localize(
            `A5E.HintNumberSelection${RemainingRemove}${SingularPlural}`,
            { number: Math.abs(number) }
        );
    }
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
                            id="{randomId}-trait-{trait}"
                            checked={selected.includes(trait)}
                            disabled={_disabledTags[trait]}
                            value={trait}
                            on:change={({ target }) => {
                                setTrait(trait, target.checked);
                            }}
                        />

                        <label for="{randomId}-trait-{trait}">
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
                value={getCustomTrait()}
                on:change={({ target }) => setCustomTrait(target)}
            />

            <p class="hint">{localize("A5E.HintSeparateBySemiColon")}</p>
        {/if}
    {/each}

    {#if hasSelectedDisabled()}
        <p>
            {localize("A5E.HintAdditionalTraits", {
                traits: getSelectedDisabledNames(),
            })}
        </p>
    {/if}

    <div class="button-container">
        <button disabled={_disableSubmit} on:click|preventDefault={submitForm}>
            Submit
        </button>
    </div>

    {#if selectionLimit && selected.length !== selectionLimit}
        <p class="hint">
            {getSelectionRemainingHint(selectionLimit - selected.length)}
        </p>
    {/if}
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

            // When checked and disabled, hide since we will show these items in a text list
            &:checked:disabled + label {
                display: none;
            }
        }

        label {
            border-radius: 3px;
            border: 1px solid #bbb;
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
        }
    }

    .button-container {
        display: flex;
    }
</style>
