<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Checkbox from "#view/snippets/Checkbox.svelte";
    import Section from "#view/snippets/Section.svelte";

    function updateEffectDuration(
        key: string,
        value: number,
        changedUnit: null | string | number = null,
    ) {
        const updates = {
            "flags.a5e.duration.unit": changedUnit ?? unit,
            "duration.seconds": null,
            "duration.rounds":
                key === "seconds" ? null : effect.duration.rounds,
            "duration.turns": key === "seconds" ? null : effect.duration.turns,
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

        effect.update(updates);
    }

    let effect: ActiveEffect = getContext("effect");
    let effectStore = $derived(effect.reactive.system);

    const { A5E } = CONFIG;

    const durationMap = {
        seconds: 1,
        minutes: 60,
        hours: 3600,
    };

    let unit = $derived(
        effect.reactive.flags?.a5e?.duration?.unit ?? "minutes",
    );

    let parsedSecondsValue = $derived(
        Math.floor((effect.reactive.duration.seconds ?? 0) / durationMap[unit]),
    );

    let durationType = $derived(
        effect.reactive.flags?.a5e?.duration?.type ?? "seconds",
    );
</script>

<div class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section heading="Effect Config">
        <FieldWrapper>
            <Checkbox
                label="A5E.effects.default"
                checked={effectStore.default ?? true}
                onUpdateSelection={(value) =>
                    effect.update({ "system.default": value })}
            />
        </FieldWrapper>

        <FieldWrapper>
            <Checkbox
                label="A5E.effects.applyToSelf"
                checked={effectStore.applyToSelf ?? false}
                onUpdateSelection={(value) =>
                    effect.update({ "system.applyToSelf": value })}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Effect Duration" --a5e-section-body-gap="0.5rem">
        <RadioGroup
            options={Object.entries(A5E.effectDurationTypes)}
            selected={durationType}
            onUpdateSelection={(value) =>
                effect.update({
                    "flags.a5e.duration.type": value,
                })}
        />

        <FieldWrapper
            --a5e-field-wrapper-direction="row"
            --a5e-field-wrapper-gap="0.75rem"
        >
            {#if durationType === "seconds"}
                <input
                    class="a5e-input a5e-input--small a5e-input--slim"
                    type="number"
                    value={parsedSecondsValue}
                    onchange={({ currentTarget }) =>
                        updateEffectDuration(
                            durationType,
                            Number(currentTarget.value),
                        )}
                />

                <select
                    class="a5e-input a5e-input--fit a5e-input--slim"
                    onchange={({ currentTarget }) =>
                        updateEffectDuration(
                            "seconds",
                            parsedSecondsValue,
                            currentTarget.value,
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
            {:else if durationType === "rounds"}
                <FieldWrapper heading="A5E.effects.durationTypes.plural.rounds">
                    <input
                        type="number"
                        class="a5e-input a5e-input--small a5e-input--slim"
                        id="{effect.id}-rounds"
                        value={effect.duration.rounds ?? 0}
                        onchange={({ currentTarget }) =>
                            updateEffectDuration(
                                "rounds",
                                Number(currentTarget.value),
                            )}
                    />
                </FieldWrapper>

                <FieldWrapper heading="A5E.effects.durationTypes.plural.turns">
                    <input
                        type="number"
                        class="a5e-input a5e-input--small a5e-input--slim"
                        name=""
                        id="{effect.id}-turns"
                        value={effect.duration.turns ?? 0}
                        onchange={({ currentTarget }) =>
                            updateEffectDuration(
                                "turns",
                                Number(currentTarget.value),
                            )}
                    />
                </FieldWrapper>
            {/if}
        </FieldWrapper>
    </Section>
</div>
