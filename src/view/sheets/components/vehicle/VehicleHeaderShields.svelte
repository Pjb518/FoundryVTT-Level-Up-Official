<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: any = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let system = $derived(actor.reactive.system);

    const counters = [
        { key: "passengers", label: "A5E.vehicle.passengers" },
        { key: "crew", label: "A5E.vehicle.crew" },
    ] as const;

    function update(key: string, value: unknown) {
        updateDocumentDataFromField(actor, key, value);
    }
</script>

<div class="a5e-vehicle-shields">
    <!-- Passengers, Crew -->
    {#each counters as { key, label }}
        <div class="a5e-vehicle-shield">
            <label
                class="a5e-vehicle-shield__label"
                for="{actor.id}-{key}-value"
            >
                {localize(label)}
            </label>

            <div class="a5e-vehicle-shield__counter">
                <input
                    id="{actor.id}-{key}-value"
                    class="a5e-vehicle-shield__input"
                    class:disable-pointer-events={!actor.isOwner}
                    type="number"
                    min="0"
                    name="system.{key}.value"
                    value={system[key].value}
                    placeholder="0"
                    onchange={({ currentTarget }) =>
                        update(currentTarget.name, Number(currentTarget.value))}
                    onclick={({ currentTarget }) => currentTarget.select()}
                />

                /

                <input
                    class="a5e-vehicle-shield__input"
                    class:disable-pointer-events={!actor.isOwner}
                    type="number"
                    min="0"
                    name="system.{key}.max"
                    value={system[key].max}
                    placeholder="0"
                    disabled={sheetIsLocked()}
                    aria-label="{localize(label)} (max)"
                    onchange={({ currentTarget }) =>
                        update(currentTarget.name, Number(currentTarget.value))}
                    onclick={({ currentTarget }) => currentTarget.select()}
                />
            </div>
        </div>
    {/each}
</div>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-vehicle-shields {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        height: 100%;
        font-family: var(--a5e-condensed-font);
    }

    .a5e-vehicle-shield {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        min-width: 3.5rem;
        padding: 0.125rem 0.25rem;

        border: 1px solid var(--a5e-border-color);
        border-radius: 4px;

        &__label {
            font-size: var(--a5e-xs-text);
        }

        &__counter {
            display: flex;
            align-items: center;
            gap: 0.125rem;
        }

        &__input {
            width: 2.25rem;
            padding-inline: 0.125rem;

            text-align: center;
            border: none;
            background: transparent;
            font-size: var(--a5e-md-text);

            &:active,
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
    }
</style>
