<header class="a5e-section-header a5e-section-header--party-viewer">
    {#each ["str", "dex", "con", "int", "wis", "cha"] as attribute}
        <span class="attribute attribute--{attribute}">{attribute}</span>
    {/each}
</header>

<style lang="scss">
    .attribute {
        text-align: center;
        line-height: 1;
        text-transform: uppercase;

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
