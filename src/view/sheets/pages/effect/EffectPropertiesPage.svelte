<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import RadioGroup from "#view/snippets/RadioGroup.svelte";
    import Checkbox from "#view/snippets/Checkbox.svelte";
    import Section from "#view/snippets/Section.svelte";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    // start

    // value = number
    // units = string
    // expiry = string
    // expired = boolean
    let effect: ActiveEffect = getContext("effect");
    let effectStore = $derived(effect.reactive.system);
    let duration = $derived(effect.reactive.duration);

    const { A5E } = CONFIG;
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

    <!-- Effect Start Summary -->
    <!-- Effect Duration -->
    <!-- Expiry Event -->

    <Section heading="Effect Duration" --a5e-section-body-gap="0.5rem">
        <!-- Effect Start Summary -->
        <FieldWrapper --a5e-field-wrapper-direction="row">
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                value={duration.value ?? 0}
                onchange={({ currentTarget }) => {
                    updateDocumentDataFromField(
                        effect,
                        "duration.value",
                        Number(currentTarget.value),
                    );
                }}
            />

            <select
                class="a5e-input a5e-input--slim a5e-input--fit"
                onchange={({ currentTarget }) =>
                    updateDocumentDataFromField(
                        effect,
                        "duration.units",
                        currentTarget.value,
                    )}
            >
                {#each CONST.ACTIVE_EFFECT_DURATION_UNITS.toReversed() as value}
                    <option {value} selected={duration.units === value}>
                        {value.capitalize()}
                    </option>
                {/each}
            </select>
        </FieldWrapper>

        <!-- TODO: Add expiry event -->
    </Section>
</div>
