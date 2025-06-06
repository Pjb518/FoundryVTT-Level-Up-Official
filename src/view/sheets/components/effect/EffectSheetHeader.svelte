<script lang="ts">
    import { getContext } from "svelte";

    import { editDocumentImage } from "#utils/view/editDocumentImage.ts";
    import updateDocumentDataFromField from "#utils/updateDocumentDataFromField.ts";

    let effect: any = getContext("effect");
</script>

<header class="a5e-effect-sheet-header">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <img
        class="a5e-effect-sheet-image"
        src={effect.reactive.img}
        alt={effect.reactive.name}
        on:click={() => editDocumentImage(effect, { type: "effect" })}
    />

    <div class="a5e-effect-sheet__name-wrapper">
        <input
            class="a5e-effect-sheet__effect-name"
            type="text"
            name="name"
            value={effect.reactive.name}
            placeholder="A5E.Name"
            on:change={({ currentTarget }) =>
                updateDocumentDataFromField(
                    effect,
                    currentTarget.name,
                    currentTarget.value,
                )}
        />
    </div>
</header>

<style lang="scss">
    .a5e-effect-sheet {
        &-header {
            display: flex;
            align-items: center;
        }

        &-image {
            width: 3rem;
            height: 3rem;
            border-radius: 4px;
            cursor: pointer;
        }

        &__name-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        &__effect-name {
            font-family: var(--a5e-secondary-font);
            font-size: var(--a5e-xxl-text);
            color: var(--a5e-text-color-dark);
            border: 0;
            background: transparent;
            text-overflow: ellipsis;
            margin: 0;
            box-shadow: none;

            &:active,
            &:focus {
                box-shadow: none;
            }
        }
    }
</style>
