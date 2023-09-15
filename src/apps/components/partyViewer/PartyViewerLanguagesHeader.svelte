<header class="languages-header">
    <h3
        class="heading heading--languages"
        data-tooltip="Known Languages"
        data-tooltip-direction="UP"
    >
        Languages
    </h3>
</header>

<style lang="scss">
    .languages-header {
        display: grid;
        grid-template-areas: var(--grid-areas);
        grid-template-columns: var(--grid-template);
        gap: 0.5rem;
        min-height: 1.75rem;
        padding: 0.375rem 0.125rem;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
    }

    .heading {
        font-size: 0.833rem;
        line-height: 1;
        text-align: left;
        font-weight: bold;

        &--languages {
            grid-area: languages;
        }
    }
</style>
