<script>
    import { getContext } from "svelte";

    export let primaryBarColor;
    export let hp;
    export let hpPrimaryPercentage;
    export let hpTempPercentage;

    const actor = getContext("actor");

    $: primaryBarColor = $actor.isBloodied ? "#8b2525" : "#0b5a2f";
    $: hpPrimaryPercentage = Math.min((hp.value / hp.max) * 100, 100);
    $: hpTempPercentage = Math.min(((hp.temp || 0) / hp.max) * 100, 100);
</script>

<div
    class="hp-bar"
    style="
        --primary-hp-percentage: {hpPrimaryPercentage};
        --temp-hp-percentage: {hpTempPercentage};
        --primary-bar-color: {primaryBarColor};
        --secondary-bar-color: #2FA6B1;
    "
>
    <slot />
</div>

<style lang="scss">
    @property --primary-hp-percentage {
        syntax: "<number>";
        inherits: true;
        initial-value: 1;
    }

    @property --temp-hp-percentage {
        syntax: "<number>";
        inherits: true;
        initial-value: 1;
    }

    .hp-bar {
        position: relative;
        width: 9rem;
        aspect-ratio: 1;
        display: inline-grid;
        place-content: center;

        &:before {
            --bar-thickness: 10px;

            background: conic-gradient(
                from 45deg,
                var(--primary-bar-color)
                    calc(var(--primary-hp-percentage) * 0.75%),
                rgba(0, 0, 0, 0.05) calc(var(--primary-hp-percentage) * 0.75%),
                rgba(0, 0, 0, 0.05) 270deg,
                transparent 0
            );

            animation: fillPrimaryRing 1s 0.25s both;
        }

        &:after {
            --bar-thickness: 5px;

            background: conic-gradient(
                from 45deg,
                var(--secondary-bar-color)
                    calc(var(--temp-hp-percentage) * 0.75%),
                transparent 0
            );

            animation: fillSecondaryRing 1s 0.25s both;
        }

        &:before,
        &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 9rem;
            height: 9rem;
            transform: rotate(180deg);
            border-radius: 50%;
            inset: 0;

            -webkit-mask: radial-gradient(
                farthest-side,
                #0000 calc(99% - var(--bar-thickness)),
                #000 calc(100% - var(--bar-thickness))
            );

            mask: radial-gradient(
                farthest-side,
                #0000 calc(99% - var(--bar-thickness)),
                #000 calc(100% - var(--bar-thickness))
            );
        }
    }

    @keyframes fillPrimaryRing {
        from {
            --primary-hp-percentage: 0;
        }
    }

    @keyframes fillSecondaryRing {
        from {
            --temp-hp-percentage: 0;
        }
    }
</style>
