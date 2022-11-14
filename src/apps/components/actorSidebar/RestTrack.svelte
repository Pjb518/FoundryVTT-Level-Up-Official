<script>
    import { getContext } from "svelte";

    const actor = getContext("actor");
</script>

<div class="rest" data-tooltip="A5E.Rest" data-tooltip-direction="DOWN">
    <i class="rest-icon fas fa-campfire" />
</div>

<style lang="scss">
    .rest {
        position: absolute;
        z-index: 4;
        display: flex;
        overflow: hidden;
        width: 2rem;
        height: 2rem;
        align-items: center;
        border-radius: 50%;

        bottom: 1rem;
        right: 0.5rem;

        &-icon {
            z-index: 1;
            display: flex;
            width: 2rem;
            height: 2rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            background-color: #f6f2eb;
            border-radius: 50%;
            box-shadow: 0 0 10px #ccc inset;
            color: rgba(0 0 0 / 0.2);
            cursor: pointer;
            font-size: 1.2rem;
            transform: translateX(-1px);

            transition: all 0.15s ease-in-out;
        }

        &:hover {
            background-color: darken(#dddace, 2.5%);

            .rest-icon {
                color: lighten(#191813, 35%);
            }
        }
    }
</style>
