<script>
</script>

<section class="utility-bar">
    <slot />
</section>

<style lang="scss">
    .utility-bar {
        position: relative;
        font-size: 0.833rem;

        display: flex;
        justify-content: space-between;
        gap: 0.125rem;

        color: rgba(0 0 0 / 0.2);
    }

    :global {
        .tjs-menu {
            --tjs-menu-background: url("/ui/denim075.png") repeat,
                rgba(0 0 0 / 0.15);
            --tjs-menu-primary-color: #deddd3;
            --tjs-menu-border: 2px solid #555;
        }

        .tjs-icon-button,
        .tjs-toggle-icon-button {
            a:hover {
                color: #555;
                transform: scale(1.2);
            }

            a.selected {
                color: #555;
                transform: scale(1.2);

                :hover {
                    transform: none;
                }
            }
        }
    }
</style>
