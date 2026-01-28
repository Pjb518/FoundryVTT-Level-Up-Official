<header class="a5e-section-header a5e-section-header--party-viewer">
    {#each ["str", "dex", "con", "int", "wis", "cha"] as attribute}
        <span
            class="a5e-party-viewer__attribute-header a5e-party-viewer__attribute--{attribute}"
            >{attribute}</span
        >
    {/each}
</header>
