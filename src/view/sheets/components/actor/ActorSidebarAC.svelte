<script lang="ts">
    import { getContext } from "svelte";

    import { getACComponents } from "#utils/getACComponents.ts";

    let actor: Actor = getContext("actor");
    let sheetIsLocked: () => boolean = getContext("sheetIsLocked");

    let actorStore = $derived(actor.reactive.system);
    let acFormula = $derived(getACComponents(actor.reactive));
</script>

<li class="a5e-actor-ac__wrapper">
    <div class="a5e-actor-ac__label-wrapper">
        <h4 class="a5e-actor-ac__label">AC</h4>

        {#if !sheetIsLocked()}
            <button
                class="a5e-button a5e-button--transparent a5e-actor-ac__config-button"
                data-tooltip="A5E.armorClass.headings.configurationTitle"
                data-tooltip-direction="DOWN"
                aria-label="Configure Armor Class"
                onclick={() => actor.configureArmorClass()}
            >
                <i class="fa-solid fa-cog"></i>
            </button>
        {/if}
    </div>

    <input
        class="a5e-actor-ac__value"
        name="system.attributes.ac.value"
        type="number"
        value={actorStore.attributes.ac.value}
        placeholder="10"
        disabled={true}
        data-tooltip={acFormula}
        data-tooltip-direction="UP"
    />

    <svg
        class="a5e-actor-ac__background"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 90 100"
        xml:space="preserve"
    >
        <path
            d="M45,100C-2.6,79.3,0,12.6,0,12.6c0-2.2,1.8-4,4.4-4.6l39.1-7.9C44,0,44.5,0,45,0c0.5,0,1,0,1.4,0.1L85.5,8
                c2.6,0.5,4.4,2.4,4.4,4.6C90,12.6,92.6,79.3,45,100L45,100z"
        />
    </svg>
</li>

<style lang="scss">
    .a5e-actor-ac {
        &__value {
            position: relative;
            display: flex;
            align-items: center;
            height: 2.5rem;
            width: 2.5rem;
            margin: auto;
            border: 0;
            background: none;
            font-weight: inherit;
            text-align: center;
            font-size: var(--a5e-xl-text);
            z-index: 1;

            &:disabled {
                color: inherit;
            }
        }

        &__label {
            padding-bottom: 0.125rem;
            font-family: var(--a5e-condensed-font);
            font-size: var(--a5e-sm-text);
            font-weight: 700;
            text-align: center;
            margin: 0.1rem;
        }

        &__label-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
        }

        &__wrapper {
            position: relative;
            font-family: var(--a5e-secondary-font);
        }

        &__background {
            position: absolute;
            height: 2.5rem;
            top: 0.0675rem;
            left: 50%;
            transform: translate(-50%, 50%);
            fill: var(--a5e-background-medium);
            z-index: 0;
        }

        &__config-button {
            position: absolute;
            right: -0.25rem;
            top: -0.6rem;
        }
    }
</style>
