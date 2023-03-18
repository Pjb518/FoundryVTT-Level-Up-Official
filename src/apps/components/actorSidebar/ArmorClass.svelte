<script>
    import { getContext } from "svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");

    $: sheetIsLocked = !$actor.isOwner
        ? true
        : $actor.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li class="ac-wrapper">
    <h4 class="ac-label">AC</h4>
    <input
        class="ac-value"
        name="system.attributes.ac"
        type="number"
        value={$actor.system.attributes.ac}
        placeholder="10"
        disabled={sheetIsLocked}
        on:change={({ target }) =>
            updateDocumentDataFromField(
                $actor,
                target.name,
                Number(target.value)
            )}
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
        font-size: 1.44rem;
        z-index: 1;

        &:disabled {
            color: inherit;
        }
    }

    .ac-label {
        font-size: 1rem;
        text-align: center;
        padding-bottom: 0.125rem;
    }

    .ac-wrapper {
        position: relative;
    }

    .ac-background {
        position: absolute;
        height: 2.5rem;
        top: 0.0675rem;
        left: 50%;
        transform: translate(-50%, 50%);
        fill: rgba(0, 0, 0, 0.15);
        z-index: 0;
    }
</style>
