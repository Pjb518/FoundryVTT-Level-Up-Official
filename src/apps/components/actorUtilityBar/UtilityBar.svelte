<script>
</script>

<section class="utility-bar">
    <slot />
</section>

<style lang="scss">
    .utility-bar {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding-right: 0.25rem;
        font-size: 1rem;
        color: rgba(0 0 0 / 0.2);
    }

    :global {
        .tjs-menu {
            --tjs-menu-background: url("/ui/denim075.png") repeat,
                rgba(0 0 0 / 0.15);
            --tjs-menu-primary-color: #deddd3;
            --tjs-menu-border: 1px solid #555;
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
