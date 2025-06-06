<script lang="ts">
    import { getContext } from "svelte";
    import { localize } from "#utils/localization/localize.ts";

    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let actor: Actor = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");
    let hp = $derived(actor.reactive.system.attributes.hp);

    let hpFields = $derived([
        {
            key: "temp",
            label: "Temp",
            value: hp.temp,
        },
        {
            key: "value",
            label: "Curr",
            value: hp.value,
        },
        {
            key: "max",
            label: "Max",
            value: hp.max,
        },
        {
            key: "bonus",
            label: "Bonus",
            value: hp.bonus,
        },
    ]);
</script>

{#if sheetIsLocked()}
    <div class="a5e-actor-hp-container">
        {#each hpFields as { key, label, value }}
            <div class="a5e-details-box">
                <label class="a5e-details-box__label" for="{actor.id}-hp-{key}">
                    {label}
                </label>

                <input
                    class="a5e-input a5e-input--slim a5e-details-box__input"
                    id="{actor.id}-hp-{key}"
                    class:disable-pointer-events={!actor.isOwner}
                    type="number"
                    name="system.attributes.hp.{key}"
                    {value}
                    placeholder="0"
                    min={key !== "bonus" ? 0 : ""}
                    disabled={key === "max"}
                    onchange={({ currentTarget }) =>
                        updateDocumentDataFromField(
                            actor,
                            currentTarget.name,
                            Number(currentTarget.value),
                        )}
                    onclick={({ currentTarget }) => currentTarget.select()}
                />
            </div>
        {/each}
    </div>
{:else}
    <div class="a5e-actor-hp-config__container">
        <button class="a5e-button" onclick={() => actor.configureHealth()}>
            <i class="fa-solid fa-gear"></i>
            {localize("A5E.hitPoints.configurationTooltip")}
        </button>
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .a5e-actor-hp-container {
        display: flex;
        gap: 0.25rem;
    }

    .a5e-actor-hp-config__container {
        padding-block: 0.275rem;

        button {
            padding: 0.125rem 0;
            border: 2px solid var(--a5e-border-color);
            border-radius: 4px;
            box-shadow: 0 0 5px var(--a5e-shadow-color) inset;
        }
    }
</style>
