<script>
    import { localize } from "#runtime/svelte/helper";

    import arraysAreEqual from "../../utils/arraysAreEqual";

    import Tag from "./Tag.svelte";

    export let disabled = false;
    export let heading = "";
    export let selected = [];
    export let red = false;
    export let sort = true;
    export let tags = {};
    export let updateFunction;

    function toggleTag(tag) {
        const tagIndex = selected.indexOf(tag);

        if (tagIndex === -1) selected.push(tag);
        else selected.splice(tagIndex, 1);

        updateFunction();
    }

    function toggleAll() {
        const optionKeys = tags.map(([key, _]) => key);
        const selectedKeys = selected;

        if (arraysAreEqual(optionKeys, selectedKeys)) selected = [];
        else selected = optionKeys;

        updateFunction();
    }

    tags = Object.entries(tags).map(([key, value]) => [key, localize(value)]);
    tags = sort ? tags.sort((a, b) => a[1] - b[1]) : tags;
</script>

<section class="a5e-form__section">
    <div class="u-align-center u-flex u-gap-md u-mb-md u-text-xs">
        <h3 class="u-text-bold u-text-sm u-mb-0">
            {localize(heading)}
        </h3>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <a on:click={toggleAll}> + Toggle All</a>
    </div>

    <ul
        class="
            u-flex u-flex-wrap u-gap-sm u-list-style-none u-m-0 u-p-0 u-text-xs u-w-full
        "
    >
        {#each tags as [value, label]}
            <Tag
                active={selected.includes(value)}
                {label}
                {value}
                red={red && red?.includes(value)}
                disabled={(disabled && !selected.includes(value)) ||
                    (red && red?.includes(value))}
                on:tagToggle={({ detail }) => toggleTag(detail)}
            />
        {/each}
    </ul>
</section>
