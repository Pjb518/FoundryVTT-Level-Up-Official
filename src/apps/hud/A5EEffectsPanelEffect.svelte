<script>
    export let description;
    export let icon;
    export let name;

    const tooltip = `
    <h3 class="a5e-effect-item__heading">${name}</h3>
    ${description}
    `;
</script>

<li
    class="a5e-effect-item"
    data-tooltip={tooltip}
    data-tooltip-direction="LEFT"
>
    <div class="a5e-effect-item__icon-wrapper">
        <img class="a5e-effect-item__icon" src={icon} alt={name} />
    </div>
</li>

<style lang="scss">
    :global(.a5e-effect-item__heading) {
        margin-bottom: 0;
        border-bottom: 0;
        font-size: 1rem;
    }

    .a5e-effect-item {
        display: flex;
        position: relative;
        cursor: pointer;

        &__icon {
            height: var(--icon-size, 2.5rem);
            width: var(--icon-size, 2.5rem);
            border: 1px solid black;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.6);
        }

        &__icon-wrapper {
            height: var(--icon-size, 2.5rem);
            width: var(--icon-size, 2.5rem);
            border: 1px solid #e9d7a1;
            border-radius: 50%;
        }

        &:hover .a5e-effect-item__details {
            display: block;
        }
    }
</style>
