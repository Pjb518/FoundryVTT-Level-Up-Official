<script>
    export let hp;
</script>

<meter class="health-bar" min="0" max={hp.max} value={hp.value}>
    {hp.value} / {hp.max}
</meter>

<style lang="scss">
    .health-bar {
        position: absolute;
        z-index: -1;
        left: 50%;
        width: 9rem;
        height: 1.1rem;
        appearance: meter;
        transform: translateX(-50%);

        &::-webkit-meter-bar,
        &::-webkit-meter-inner-element {
            width: 100%;
            height: 1.1rem;
            border: 0;
            background: #bbb;
            outline: none;
        }

        // Set the bar colour
        &::-webkit-meter-optimum-value {
            background: #0b5a2f;
        }
    }
</style>
