<script>
    export let icon;
    export let name;
</script>

<li class="a5e-effect-item">
    <img class="a5e-effect-item__icon" src={icon} alt={name} />
    <!-- {name} -->
</li>

<style lang="scss">
    .a5e-effect-item {
        display: flex;
        position: relative;
        border: 1px solid #e9d7a1;
        border-radius: 50%;
        cursor: pointer;

        &__icon {
            height: var(--icon-size, 2.5rem);
            width: var(--icon-size, 2.5rem);
            border: 1px solid black;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.6);
        }
    }
</style>
