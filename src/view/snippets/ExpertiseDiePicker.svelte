<script lang="ts">
    import { prepareExpertiseDiceOptions } from "#utils/view/helpers/prepareExpertiseDiceOptions.ts";

    import RadioGroup from "#view/snippets/RadioGroup.svelte";

    type Props = {
        type?: "character" | "npc";
        selected: string;
        source?: string;

        onUpdateSelection?: (value: string) => void;
    };

    let {
        type = "character",
        selected,
        source = "",
        onUpdateSelection,
    }: Props = $props();

    const options = prepareExpertiseDiceOptions(type) as string[][];
    const hideExpertiseDice = game.settings.get(
        "a5e",
        "hideExpertiseDice",
    ) as boolean;

    let buttons = $derived(
        source.length
            ? [{ classes: "icon fas fa-question-circle", tooltip: source }]
            : [],
    );
</script>

{#if !hideExpertiseDice}
    <RadioGroup
        heading="A5E.expertiseDie.title"
        {buttons}
        {options}
        {selected}
        allowDeselect={false}
        optionStyles="min-width: 1.75rem; text-align: center;"
        {onUpdateSelection}
    />
{/if}
