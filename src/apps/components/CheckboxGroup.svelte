<script>
    import { createEventDispatcher } from "svelte";

    import FieldWrapper from "./FieldWrapper.svelte";
    import Tag from "./Tag.svelte";

    import arraysAreEqual from "../../utils/arraysAreEqual";

    export let disabled = false;
    export let disabledOptions = [];
    export let heading = "";
    export let listClasses = "";
    export let options = [];
    export let optionStyles = "";
    export let orange = [];
    export let selected = [];
    export let showToggleAllButton = false;
    export let red = [];

    function getButtons() {
        if (!showToggleAllButton) return [];

        return [
            {
                classes: "u-text-xs",
                label: "+ Toggle All",
                handler: toggleAll,
            },
        ];
    }

    function updateSelection(value) {
        const newSelections = new Set(selected);

        if (newSelections.has(value)) newSelections.delete(value);
        else newSelections.add(value);

        dispatch("updateSelection", [...newSelections]);
    }

    function toggleAll() {
        const optionKeys = options.map(([key]) => key);
        const selectedKeys = selected;

        if (arraysAreEqual(optionKeys, selectedKeys)) selected = [];
        else selected = optionKeys;

        dispatch("updateSelection", selected);
    }

    const dispatch = createEventDispatcher();
    const buttons = getButtons();
</script>

<FieldWrapper
    {heading}
    {buttons}
    --a5e-field-wrapper-header-item-justification="flex-start"
    --a5e-field-wrapper-header-gap="0.5rem"
>
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
                on:tagToggle={({ detail }) => updateSelection(detail)}
            />
        {/each}
    </ul>
</FieldWrapper>
