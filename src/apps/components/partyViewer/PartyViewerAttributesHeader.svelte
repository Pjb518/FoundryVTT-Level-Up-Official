<script>
</script>

<header class="attributes-header">
    <span class="attribute attribute--str">Str</span>
    <span class="attribute attribute--dex">Dex</span>
    <span class="attribute attribute--con">Con</span>
    <span class="attribute attribute--int">Int</span>
    <span class="attribute attribute--wis">Wis</span>
    <span class="attribute attribute--cha">Cha</span>
</header>

<style lang="scss">
    .attributes-header {
        display: grid;
        grid-template-areas: var(--grid-areas);
        grid-template-columns: var(--grid-template);
        gap: 0.5rem;
        min-height: 1.75rem;
        padding: 0.375rem 0.125rem;
        border-bottom: 1px solid #ccc;
        border-top: 1px solid #ccc;
    }

    .attribute {
        font-weight: bold;
        text-align: center;
        line-height: 1;

        &--str {
            grid-area: str;
        }

        &--dex {
            grid-area: dex;
        }
        &--con {
            grid-area: con;
        }
        &--int {
            grid-area: int;
        }
        &--wis {
            grid-area: wis;
        }
        &--cha {
            grid-area: cha;
        }
    }
</style>
