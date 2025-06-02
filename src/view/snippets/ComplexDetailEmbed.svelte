<script lang="ts">
    import CheckboxGroup from "#view/snippets/CheckboxGroup.svelte";
    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";

    type Props = {
        configObject?: Record<string, any>;
        disabledProperties?: string[];
        existingProperties?: string[];
        headings?: Record<string, any>;
        hint?: string;
        max?: number;
        onUpdateSelection: (value: string[]) => void;
    };

    function updateFunction() {
        const updated = [
            ...Object.entries(proficiencies).reduce(
                (acc: string[], [key, value]) => {
                    if (key === "other") return acc;
                    acc.push(...value);
                    return acc;
                },
                [],
            ),
            ...otherProficiencies
                .split(";")
                .map((value) => value.trim())
                .filter(Boolean),
        ];

        onUpdateSelection(updated);
    }

    let {
        configObject = {},
        disabledProperties = [],
        existingProperties = [],
        headings = {},
        hint = "",
        max = 0,
        onUpdateSelection,
    }: Props = $props();

    const configKeys = [...Object.keys(configObject), "other"];

    let proficiencies = $derived(
        existingProperties.reduce(
            (acc: Record<string, string[]>, curr) => {
                let found = false;
                configKeys.forEach((key) => {
                    if (
                        Object.keys(configObject?.[key] ?? []).includes?.(curr)
                    ) {
                        acc[key].push(curr);
                        found = true;
                    }
                });

                if (!found) acc.other.push(curr);
                return acc;
            },
            Object.fromEntries(configKeys.map((key) => [key, []])),
        ),
    );

    let otherProficiencies = $derived(proficiencies.other.join("; "));
</script>

<FieldWrapper {hint} --a5e-field-wrapper-gap="0.75rem">
    {#each configKeys as key}
        {#if key !== "other"}
            <CheckboxGroup
                heading={headings[key] ?? key}
                options={Object.entries(configObject[key])}
                selected={proficiencies[key]}
                disabled={!!max && existingProperties.length >= max}
                disabledOptions={disabledProperties}
                showToggleAllButton={true}
                onUpdateSelection={(value) => {
                    proficiencies[key] = value;
                    updateFunction();
                }}
            />
        {/if}
    {/each}

    <FieldWrapper>
        <input
            class="a5e-input a5e-input--slim"
            type="text"
            value={otherProficiencies || ""}
            onchange={({ currentTarget }) => {
                otherProficiencies = currentTarget.value;
                updateFunction();
            }}
        />
    </FieldWrapper>
</FieldWrapper>
