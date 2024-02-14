<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";

    export let configObject: Record<string, any> = {};
    export let existingProperties: string[] = [];
    export let headings: Record<string, string> = {};
    export let hint: string = "";
    export let max: number = 0;

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

        dispatch("updateSelection", updated);
    }

    const configKeys = [...Object.keys(configObject), "other"];
    const dispatch = createEventDispatcher();

    $: proficiencies = existingProperties.reduce(
        (acc: Record<string, string[]>, curr) => {
            let found = false;
            configKeys.forEach((key) => {
                if (Object.keys(configObject?.[key] ?? []).includes?.(curr)) {
                    acc[key].push(curr);
                    found = true;
                }
            });

            if (!found) acc.other.push(curr);
            return acc;
        },
        Object.fromEntries(configKeys.map((key) => [key, []])),
    );

    $: otherProficiencies = proficiencies.other.join("; ");
</script>

<FieldWrapper {hint} --a5e-field-wrapper-gap="0.75rem">
    {#each configKeys as key}
        {#if key !== "other"}
            <CheckboxGroup
                heading={headings[key] ?? key}
                options={Object.entries(configObject[key])}
                selected={proficiencies[key]}
                disabled={!!max && existingProperties.length >= max}
                showToggleAllButton={true}
                on:updateSelection={({ detail }) => {
                    proficiencies[key] = detail;
                    updateFunction();
                }}
            />
        {/if}
    {/each}

    <FieldWrapper>
        <input
            class="a5e-input"
            type="text"
            value={otherProficiencies || ""}
            on:change={({ target }) => {
                // @ts-ignore
                otherProficiencies = target.value;
                updateFunction();
            }}
        />
    </FieldWrapper>
</FieldWrapper>
