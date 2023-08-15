<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";
    import FormSection from "../FormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";

    const effect = getContext("effect");
    const { A5E } = CONFIG;

    const durationMap = {
        seconds: 1,
        minutes: 60,
        hours: 3600,
    };

    function updateEffectDuration(key, value, changedUnit = null) {
        const updates = {
            "flags.a5e.duration.unit": changedUnit ?? unit,
            "duration.seconds": null,
            "duration.rounds": null,
            "duration.turns": null,
        };

        if (key === "seconds") {
            // TODO: Think about what we should do when we switch units.
            const newValue = Math.max(0, value * durationMap[unit]);
            updates["duration.seconds"] = newValue;
        } else if (key === "rounds") updates["duration.rounds"] = value;
        else if (key === "turns") updates["duration.turns"] = value;

        $effect.update(updates);
    }

    $: parsedSecondsValue = Math.floor(
        ($effect.duration.seconds ?? 0) / durationMap[unit]
    );
    $: durationType = $effect.flags?.a5e?.duration?.type ?? "seconds";
    $: unit = $effect.flags?.a5e?.duration?.unit ?? "minutes";
</script>

<article>
    <FormSection heading="Effect Type">
        <RadioGroup
            options={Object.entries(A5E.itemActiveEffectTypes)}
            selected={$effect.flags?.a5e?.transferType ?? "passive"}
            on:updateSelection={({ detail }) =>
                $effect.update({ "flags.a5e.transferType": detail })}
        />
    </FormSection>

    {#if $effect.flags?.a5e?.transferType === "onUse"}
        <FormSection
            heading="Effect Duration"
            --gap="0.75rem"
            --direction="column"
        >
            <RadioGroup
                options={Object.entries(A5E.effectDurationTypes)}
                selected={durationType}
                on:updateSelection={({ detail }) =>
                    $effect.update({
                        "flags.a5e.duration.type": detail,
                    })}
            />

            {#if durationType === "seconds"}
                <div class="u-flex u-gap-md">
                    <input
                        class="a5e-input a5e-input--small a5e-input--slim"
                        type="number"
                        value={parsedSecondsValue}
                        on:change={({ target }) =>
                            updateEffectDuration(
                                durationType,
                                Number(target.value)
                            )}
                    />

                    <select
                        class="u-w-fit"
                        on:change={({ target }) =>
                            updateEffectDuration(
                                null,
                                parsedSecondsValue,
                                target.value
                            )}
                    >
                        {#each Object.entries(A5E.effectDurationUnits) as [durationUnit, label]}
                            <option
                                value={durationUnit}
                                selected={durationUnit === unit}
                            >
                                {localize(label)}
                            </option>
                        {/each}
                    </select>
                </div>
            {:else if durationType === "rounds"}
                <input
                    type="number"
                    name=""
                    value={$effect.duration.rounds ?? 0}
                    on:change={({ target }) =>
                        updateEffectDuration(
                            durationType,
                            Number(target.value)
                        )}
                />
            {:else if durationType === "turns"}
                <input
                    type="number"
                    name=""
                    value={$effect.duration.turns ?? 0}
                    on:change={({ target }) =>
                        updateEffectDuration(
                            durationType,
                            Number(target.value)
                        )}
                />
            {/if}
        </FormSection>
    {/if}

    <style lang="scss">
        article {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            overflow: hidden;
        }
    </style>
</article>
