<script>
    import { getContext } from "svelte";

    import getACComponents from "../../../utils/getACComponents";

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : ($actor.flags?.a5e?.sheetIsLocked ?? true);

    $: acFormula = getACComponents($actor);
</script>

<li class="ac-wrapper">
    <div class="ac-label__wrapper">
        <h4 class="ac-label">AC</h4>

        {#if !sheetIsLocked}
            <button
                class="icon fas fa-cog a5e-button a5e-button--config ac__config-button"
                data-tooltip="A5E.ArmorClassConfigurationTitle"
                data-tooltip-direction="DOWN"
                on:click={() => $actor.configureArmorClass()}
            />
        {/if}
    </div>

    <input
        class="ac-value"
        name="system.attributes.ac.value"
        type="number"
        value={$actor.system.attributes.ac.value}
        placeholder="10"
        disabled={true}
        data-tooltip={acFormula}
        data-tooltip-direction="UP"
    />

    <svg
        class="ac-background"
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
    .ac-value,
    .ac-value[type="number"] {
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
        font-size: var(--a5e-text-size-xl);
        z-index: 1;

        &:disabled {
            color: inherit;
        }
    }

    .ac-label {
        padding-bottom: 0.125rem;
        font-family: var(--a5e-font-serif);
        font-size: var(--a5e-text-size-sm);
        font-weight: 700;
        text-align: center;
    }

    .ac-label__wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
    }

    .ac-wrapper {
        position: relative;
        font-family: var(--a5e-font-serif);
    }

    .ac-background {
        position: absolute;
        height: 2.5rem;
        top: 0.0675rem;
        left: 50%;
        transform: translate(-50%, 50%);
        fill: var(--a5e-background-medium);
        z-index: 0;
    }

    .ac__config-button {
        position: absolute;
        right: -0.25rem;
        top: -0.6rem;
    }
</style>
