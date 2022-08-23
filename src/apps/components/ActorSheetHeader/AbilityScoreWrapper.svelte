<li class="container">
    <slot />
</li>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        color: #f6f2eb;
        font-family: "Modesto Condensed", serif;
        border-radius: 3px;
        gap: 0.25rem;
        overflow: hidden;
    }
</style>
