<script>
    export let dieSize;
    export let isFumble;
    export let isCritical;
    export let isDiscarded;
    export let result;
</script>

<li
    class={`a5e-die a5e-die--${dieSize}`}
    class:discarded-die={isDiscarded}
    class:fumbled-die={isFumble}
    class:critical-die={isCritical}
>
    {result}
</li>

<style lang="scss">
    .discarded-die {
        filter: sepia(0.5) contrast(0.75) opacity(0.4);
    }

    .fumbled-die {
        color: #aa0200;
        filter: sepia(0.5) hue-rotate(-60deg);

        &.discarded-die {
            filter: sepia(0.5) hue-rotate(-60deg) contrast(0.75) opacity(0.4);
        }
    }

    .critical-die {
        color: #18520b;
        filter: sepia(0.5) hue-rotate(60deg);

        &.discarded-die {
            filter: sepia(0.5) hue-rotate(60deg) contrast(0.75) opacity(0.4);
        }
    }
</style>
