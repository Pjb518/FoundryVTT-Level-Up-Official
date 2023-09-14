<svelte:options accessors={true} />

<script>
    import { setContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    export let tokenDocument;
    export let HUD;

    const token = new TJSDocument(tokenDocument);

    const data = HUD.getData();
    const statusEffects = Object.values(data.statusEffects);
    const genericEffects = Object.values(data.genericConditions);

    setContext("token", token);
</script>

<div class="status-effects-conditions">
    {#each statusEffects as effect}
        <div class="conditon-container">
            <img
                class="effect-control {effect.cssClass}"
                src={effect.src}
                title={effect.title ?? ""}
                alt={effect.title ?? ""}
                data-status-id={effect.id}
            />
            <div class="condition-name">{effect.title}</div>
        </div>
    {/each}
</div>

<hr class="a5e-rule" />

<div class="generic-effects-container">
    {#each genericEffects as effect}
        <div class="condition-container">
            <img
                class="effect-control {effect.cssClass}"
                src={effect.src}
                title={effect.title ?? ""}
                alt={effect.title ?? ""}
                data-status-id={effect.id}
            />
        </div>
    {/each}
</div>

<style lang="scss">
    .status-effects-conditions {
        display: grid;
        grid-template-columns: repeat(3, minmax(8em, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
        padding-bottom: 0.5rem;
        font-size: 1.2rem;
        line-height: 1.2rem;
        text-align: left;
        width: max-content;

        .condition-container .effect-control {
            &.active {
                filter: invert(62%) sepia(32%) saturate(6599%)
                    hue-rotate(110deg) brightness(96%) contrast(83%);
            }

            &.active + .condition-name {
                color: $color-primary-light;
                font-weight: 600;
            }
        }
    }

    .generic-effects-container {
        display: flex;
        justify-content: space-around;
        padding-block-start: 0.375rem;
        padding-block-end: 0.75rem;

        .condition-container {
            border-radius: 50%;
            border: 3px solid black;
            aspect-ratio: 1/1;

            &:hover {
                outline: 3px solid #ccc;
            }

            .active {
                border-radius: 50%;
                outline: 4px solid #ccc;
                // border: 3px solid #ccc;
            }
        }
    }

    .condition-container {
        display: flex;
        position: relative;
        align-items: center;
        margin-block: 0.125rem;
        color: rgb(204 204 204);
        cursor: pointer;
        transition: $standard-transition;

        &:hover {
            color: $color-primary-light;
        }

        // Generate filter
        // https://stackoverflow.com/questions/22252472/how-to-change-the-color-of-an-svg-element
        .effect-control {
            width: 100%;
            padding-inline-end: calc(100% - 24px);
            opacity: 1;
        }

        .condition-name {
            position: absolute;
            padding-left: 0.25em;
            left: 24px;
            max-width: calc(100% - 24px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            pointer-events: none;
        }
    }

    .clear-all-conditions {
        position: absolute;
        bottom: 100%;
        right: -1px;
        padding: 0.25em;
        color: rgb(204 204 204);
        border-radius: 4px 4px 0 0;
        background-color: rgba(51 51 51 / 0.6);
        cursor: pointer;

        &:hover {
            color: $color-secondary;
        }
    }
</style>
