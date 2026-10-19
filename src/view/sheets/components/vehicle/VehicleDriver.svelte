<script lang="ts">
    import { getContext } from "svelte";

    import { localize } from "#utils/localization/localize.ts";

    import DropArea from "#view/snippets/DropArea.svelte";

    let actor: any = getContext("actor");
    let sheet: any = getContext("sheet");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let driver = $derived(
        actor.reactive.system.driver ? actor.reactive.driver : null,
    );

    async function onDriverDropped({
        dragEvent,
        uuid,
    }: {
        dragEvent: DragEvent;
        uuid: string;
    }) {
        const dropped = await fromUuid(uuid);
        if (dropped) await sheet._onDropActor(dragEvent, dropped);
    }

    function removeDriver() {
        actor.update({ "system.driver": null });
    }
</script>

<div class="a5e-vehicle-driver">
    <span class="a5e-vehicle-driver__label">
        {localize("A5E.vehicle.driver")}
    </span>

    {#if driver}
        <div class="a5e-vehicle-driver__card">
            <img
                class="a5e-vehicle-driver__image"
                src={driver.img}
                alt={driver.name}
            />

            <button
                type="button"
                class="a5e-vehicle-driver__name"
                onclick={() => driver.sheet?.render(true)}
            >
                {driver.name}
            </button>

            {#if !sheetIsLocked()}
                <button
                    type="button"
                    class="a5e-button a5e-button--transparent"
                    aria-label={localize("A5E.vehicle.removeDriver")}
                    data-tooltip="A5E.vehicle.removeDriver"
                    onclick={removeDriver}
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            {/if}
        </div>
    {:else if actor.isOwner}
        <DropArea
            type="uuid"
            documentType="Actor"
            onDocumentDropped={onDriverDropped}
        />
    {:else}
        <p class="a5e-vehicle-driver__empty">
            {localize("A5E.vehicle.noDriver")}
        </p>
    {/if}
</div>

<style lang="scss">
    .a5e-vehicle-driver {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.125rem;
        height: 100%;

        &__label {
            font-size: var(--a5e-md-text);
            font-weight: 700;
            font-family: var(--a5e-condensed-font);
        }

        &__card {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem;

            border: 1px solid var(--a5e-border-color);
            border-radius: 4px;
        }

        &__image {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            object-fit: cover;
            object-position: top;
        }

        &__name {
            flex-grow: 1;

            text-align: left;
            font-weight: 600;
            background: none;
            border: none;
            cursor: pointer;
        }

        &__empty {
            margin: 0;
            font-style: italic;
        }
    }
</style>
