<script>
    import { createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import arraysAreEqual from "../../utils/arraysAreEqual";

    import Tag from "./Tag.svelte";

    export let heading = "";
    export let options = [];
    export let selected = [];
    export let disabled = false;
    export let disabledOptions = [];
    export let red = [];
    export let orange = [];
    export let sort = true;
    export let listClasses = "";
    export let optionStyles = "";

    const dispatch = createEventDispatcher();

    function toggleTag(tag) {
        const newSelections = new Set(selected);

        if (newSelections.has(tag)) newSelections.delete(tag);
        else newSelections.add(tag);

        dispatch("updateSelection", [...newSelections]);
    }

    function toggleAll() {
        const optionKeys = options.map(([key]) => key);
        const selectedKeys = selected;

        if (arraysAreEqual(optionKeys, selectedKeys)) selected = [];
        else selected = optionKeys;

        dispatch("updateSelection", selected);
    }

    options = sort ? options.sort((a, b) => a[1] - b[1]) : options;

    // export let disabled = false;
    // export let heading = "";
    // export let selected = [];
    // export let red = false;
    // export let sort = true;
    // export let options = {};
    // export let updateFunction;

    // function toggleTag(tag) {
    //     const tagIndex = selected.indexOf(tag);

    //     if (tagIndex === -1) selected.push(tag);
    //     else selected.splice(tagIndex, 1);

    //     updateFunction();
    // }

    // function toggleAll() {
    //     const optionKeys = tags.map(([key, _]) => key);
    //     const selectedKeys = selected;

    //     if (arraysAreEqual(optionKeys, selectedKeys)) selected = [];
    //     else selected = optionKeys;

    //     updateFunction();
    // }

    // tags = Object.entries(tags).map(([key, value]) => [key, localize(value)]);
    // tags = sort ? tags.sort((a, b) => a[1] - b[1]) : tags;
</script>

<section class="a5e-form__section">
    <div class="u-align-center u-flex u-gap-md u-mb-md u-text-xs">
        <h3 class="u-text-bold u-text-sm u-mb-0">
            {localize(heading)}
        </h3>

        <button class="toggle-button" on:click|preventDefault={toggleAll}>
            + Toggle All
        </button>
    </div>

    <ul
        class="
            u-flex
            u-flex-wrap
            u-gap-sm
            u-list-style-none
            u-m-0
            u-p-0
            u-text-xs
            u-w-full
            {listClasses}
        "
    >
        {#each options as [value, label]}
            <Tag
                active={selected.includes(value)}
                {label}
                {optionStyles}
                {value}
                red={red?.includes(value)}
                orange={orange?.includes(value)}
                disabled={disabledOptions.includes(value) ||
                    (disabled && !selected.includes(value))}
                on:tagToggle={({ detail }) => toggleTag(detail)}
            />
        {/each}
    </ul>
</section>

<style lang="scss">
    h3 {
        border-bottom: 0;
    }

    .toggle-button {
        display: flex;
        align-items: center;
        padding: 0;
        margin: 0;
        width: max-content;

        border: none;
        background: none;

        font-size: var(--font-size, $font-size-xs);
        line-height: var(--line-height, normal);
        color: var(--text-color, #555);
        transition: $standard-transition;

        &:hover,
        &:focus {
            box-shadow: none;
            color: var(--text-hover-color, #000);
        }
    }
</style>
