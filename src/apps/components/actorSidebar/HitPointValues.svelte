<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/util/i18n";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    export let hp;
    export let hpFields;

    $: hpFields = [
        {
            key: "temp",
            label: "Temp. HP",
            value: hp.temp,
        },
        {
            key: "value",
            label: "Curr. HP",
            value: hp.value,
        },
        {
            key: "max",
            label: "Max HP",
            value: hp.max,
        },
        {
            key: "bonus",
            label: "Bonus HP",
            value: hp.bonus,
        },
    ];

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : ($actor.flags?.a5e?.sheetIsLocked ?? true);
</script>

{#if sheetIsLocked}
    <div class="hp-container">
        {#each hpFields as { key, label, value }}
            <div class="a5e-details-box">
                <label
                    class="a5e-details-box__label"
                    for="{$actor.id}-hp-{key}"
                >
                    {label}
                </label>

                <input
                    id="{$actor.id}-hp-{key}"
                    class="a5e-details-box__input"
                    class:disable-pointer-events={!$actor.isOwner}
                    type="number"
                    name="system.attributes.hp.{key}"
                    {value}
                    placeholder="0"
                    min={key !== "bonus" ? 0 : ""}
                    disabled={key === "max"}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            Number(target.value),
                        )}
                    on:click={({ target }) => target.select()}
                />
            </div>
        {/each}
    </div>
{:else}
    <div class="hp-config__container">
        <button class="a5e-button" on:click={() => $actor.configureHealth()}>
            <i class="icon fas fa-gear" />
            {localize("A5E.HitPointsConfigurationTooltip")}
        </button>
    </div>
{/if}

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .hp-container {
        display: flex;
        gap: 0.25rem;
    }

    .hp-config__container {
        padding-block: 0.275rem;

        button {
            padding: 0.125rem 0;
            border: 2px solid var(--a5e-border-color);
            border-radius: 4px;
            box-shadow: 0 0 5px var(--a5e-shadow-color) inset;
        }
    }
</style>
