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
        gap: 0.275rem;

        color: rgba(0 0 0 / 0.2);
    }

    :global {
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
