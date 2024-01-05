<script>
    import { localize } from "#runtime/svelte/helper";
    import { getContext } from "svelte";

    import FormSection from "../LegacyFormSection.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import Checkbox from "../Checkbox.svelte";

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
            "duration.rounds":
                key === "seconds" ? null : $effect.duration.rounds,
            "duration.turns": key === "seconds" ? null : $effect.duration.turns,
        };

        if (key === "seconds") {
            let newValue;

            if (changedUnit && unit !== changedUnit) {
                updates["flags.a5e.duration.unit"] = changedUnit;
                newValue = Math.max(
                    0,
                    parsedSecondsValue * durationMap[changedUnit],
                );
            } else newValue = Math.max(0, value * durationMap[unit]);

            updates["duration.seconds"] = newValue;
        } else if (["rounds", "turns"].includes(key)) {
            updates[`duration.${key}`] = Math.max(0, value);
        }

        $effect.update(updates);
    }

    $: parsedSecondsValue = Math.floor(
        ($effect.duration.seconds ?? 0) / durationMap[unit],
    );
    $: durationType = $effect.flags?.a5e?.duration?.type ?? "seconds";
    $: unit = $effect.flags?.a5e?.duration?.unit ?? "minutes";
</script>

<article>
    {#if $effect.flags?.a5e?.transferType !== "onUse"}
        <FormSection heading="Effect Type">
            <RadioGroup
                options={Object.entries(A5E.itemActiveEffectTypes)}
                selected={$effect.flags?.a5e?.transferType ?? "passive"}
                on:updateSelection={({ detail }) =>
                    $effect.update({ "flags.a5e.transferType": detail })}
            />
        </FormSection>
    {/if}

    {#if $effect.flags?.a5e?.transferType === "onUse"}
        <FormSection>
            <Checkbox
                label="A5E.effects.applyToSelf"
                checked={$effect.flags?.a5e?.applyToSelf ?? false}
                on:updateSelection={({ detail }) =>
                    $effect.update({ "flags.a5e.applyToSelf": detail })}
            />
        </FormSection>

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
                                Number(target.value),
                            )}
                    />

                    <select
                        class="u-w-fit"
                        on:change={({ target }) =>
                            updateEffectDuration(
                                "seconds",
                                parsedSecondsValue,
                                target.value,
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
                <div class="u-flex u-gap-xl">
                    <div class="u-flex u-flex-col u-gap-md">
                        <label
                            for="{$effect.id}-rounds"
                            class="u-pointer u-text-bold"
                        >
                            {localize(
                                "A5E.effects.durationTypes.plural.rounds",
                            )}
                        </label>

                        <input
                            type="number"
                            class="a5e-input a5e-input--small a5e-input--slim"
                            id="{$effect.id}-rounds"
                            value={$effect.duration.rounds ?? 0}
                            on:change={({ target }) =>
                                updateEffectDuration(
                                    "rounds",
                                    Number(target.value),
                                )}
                        />
                    </div>

                    <div class="u-flex u-flex-col u-gap-md">
                        <label
                            for="{$effect.id}-turns"
                            class="u-pointer u-text-bold"
                        >
                            {localize("A5E.effects.durationTypes.plural.turns")}
                        </label>

                        <input
                            type="number"
                            class="a5e-input a5e-input--small a5e-input--slim"
                            name=""
                            id="{$effect.id}-turns"
                            value={$effect.duration.turns ?? 0}
                            on:change={({ target }) =>
                                updateEffectDuration(
                                    "turns",
                                    Number(target.value),
                                )}
                        />
                    </div>
                </div>
            {/if}
        </FormSection>
    {/if}
</article>

<style lang="scss">
    article {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        overflow: hidden;
    }
</style>
