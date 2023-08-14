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

    function updateDuration(key, value, changedUnit = null) {
        if (key === "seconds") {
            const newValue = Math.max(0, value * durationMap[unit]);
            $effect.update({
                "flags.a5e.duration.unit": changedUnit ?? unit,
                "duration.seconds": newValue,
            });
        } else
            $effect.update({ [`duration.${key}`]: value === 0 ? null : value });
    }

    function updateUnit(unit) {
        updateDuration("seconds", parsedSecondsValue, unit);
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
        <FormSection heading="Effect Duration">
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
                        class="small-input"
                        type="number"
                        value={parsedSecondsValue}
                        on:change={({ target }) =>
                            updateDuration(durationType, Number(target.value))}
                    />
                    <select
                        class="u-w-fit"
                        on:change={({ target }) => updateUnit(target.value)}
                    >
                        {#each Object.entries(A5E.effectDurationUnits) as [value, label]}
                            <option {value} selected={value === unit}>
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
                        updateDuration(durationType, Number(target.value))}
                />
            {:else if durationType === "turns"}
                <input
                    type="number"
                    name=""
                    value={$effect.duration.turns ?? 0}
                    on:change={({ target }) =>
                        updateDuration(durationType, Number(target.value))}
                />
            {/if}
        </FormSection>
    {/if}

    <style lang="scss">
        article {
            display: flex;
            flex-direction: column;
            flex: 1;
            gap: 0.75rem;
            overflow: hidden;
        }

        .small-input {
            width: 3rem;
            text-align: center;
            font-size: 0.833rem;
        }
    </style>
</article>
