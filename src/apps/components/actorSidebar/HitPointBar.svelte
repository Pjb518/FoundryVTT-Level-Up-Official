<script>
    export let hp;

    $: hpPrimaryPercentage = Math.floor(
        Math.min((hp.value / hp.max) * 100, 100)
    );

    $: hpTempPercentage = Math.min(((hp.temp || 0) / hp.max) * 100, 100);
</script>

<div
    class="hp-bar"
    style="
        --primary-hp-percentage: {hpPrimaryPercentage};
        --temp-hp-percentage: {hpTempPercentage};
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
                from 41.5deg,
                hsl(var(--primary-hp-percentage), 50%, 35%)
                    calc(var(--primary-hp-percentage) * 0.775%),
                rgba(0, 0, 0, 0.08) calc(var(--primary-hp-percentage) * 0.775%),
                rgba(0, 0, 0, 0.08) 279deg,
                transparent 0
            );

            @media (prefers-reduced-motion: no-preference) {
                animation: fillPrimaryRing 1s 0.25s both;
            }
        }

        &:after {
            --bar-thickness: 5px;

            background: conic-gradient(
                from 41.5deg,
                var(--secondary-bar-color)
                    calc(var(--temp-hp-percentage) * 0.775%),
                transparent 0
            );

            @media (prefers-reduced-motion: no-preference) {
                animation: fillSecondaryRing 1s 0.25s both;
            }
        }

        &:before,
        &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            width: 9rem;
            height: 9rem;
            transform: rotate(90deg);
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
