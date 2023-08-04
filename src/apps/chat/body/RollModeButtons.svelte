<script>
    import { createEventDispatcher } from "svelte";

    const damageButtons = [
        {
            label: "Normal",
            mode: 0,
            icon: "fa-heart-circle-plus",
        },
        {
            label: "Disadvantage",
            mode: -1,
            icon: "fa-skull",
        },
        {
            label: "Advantage",
            mode: 1,
            icon: "fa-shield",
        },
    ];

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
<div class="menu" on:click|stopPropagation role="menu">
    <i class="menu__button fa-dice fa-solid" />

    <ol class="roll-mode-buttons">
        <h3>Select Roll Mode</h3>

        <hr class="a5e-rule" />

        {#each damageButtons as { label, mode }}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li
                class="roll-mode-buttons__item"
                role="menuitem"
                on:click|stopPropagation={() =>
                    dispatch("toggleRollMode", mode)}
            >
                <span>{label}</span>
            </li>
        {/each}
    </ol>
</div>

<style lang="scss">
    .roll-mode-buttons {
        display: none;
        position: absolute;
        top: 0;
        right: 0;
        transform: translateY(-100%);
        margin: 0;
        padding: 0;
        list-style: none;
        background: #e1ddd5;
        color: #7e7960;
        border: 1px solid #ccc;
        border-radius: 3px;

        h3 {
            margin: 0;
            padding: 0.125rem 0.5rem;
            font-size: 0.833rem;
            font-weight: 700;
            color: #191813;
            border-bottom: 0;
            white-space: nowrap;
            cursor: initial;
        }

        &__item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            flex-wrap: nowrap;
            padding: 0.125rem 0.5rem;
            white-space: nowrap;

            transition: all 0.15s ease-in-out;

            &:hover {
                color: #191813;
            }
        }
    }

    .menu {
        position: relative;
        margin-left: auto;

        &:hover .roll-mode-buttons {
            display: block;
        }

        &__button {
            width: fit-content;
            margin: 0;
            padding: 0.25rem 0.375rem;
            line-height: 1;
            color: #7e7960;
            background: rgba(0, 0, 0, 0.05);
            border: 1px solid #ccc;
            border-radius: 3px;

            transition: all 0.15s ease-in-out;

            &:hover {
                color: #191813;
                box-shadow: none;
            }
        }
    }
</style>
