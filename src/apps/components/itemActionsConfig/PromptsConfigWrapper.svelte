<script>
    import { getContext } from "svelte";

    import FormSection from "../FormSection.svelte";

    const item = getContext("item");
    const actionId = getContext("actionId");

    function deletePrompt(event) {
        const { promptId } = event.target.closest(".prompt").dataset;

        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [`-=${promptId}`]: null,
            },
        });
    }

    function duplicatePrompt() {
        const newPrompt = foundry.utils.duplicate(prompt);

        $item.update({
            [`system.actions.${actionId}.prompts`]: {
                [foundry.utils.randomID()]: newPrompt,
            },
        });
    }

    export let prompt;
    export let promptId;
</script>

<li class="prompt" data-prompt-id={promptId}>
    <FormSection>
        <div class="button-wrapper">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <i class="button fa-solid fa-clone" on:click={duplicatePrompt} />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <i
                class="button button--delete fas fa-trash"
                on:click={deletePrompt}
            />
        </div>

        <section class="prompt-config-wrapper">
            <slot />
        </section>
    </FormSection>
</li>

<style lang="scss">
    .button-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        color: #999;
        font-size: 1rem;
    }

    .button {
        margin: 0;
        padding: 0.25rem;
        cursor: pointer;
        transition: $standard-transition;

        &:hover {
            transform: scale(1.2);
        }
    }

    .button {
        margin: 0;
        padding: 0.25rem;
        cursor: pointer;
        transition: $standard-transition;

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &--delete:hover {
            color: $color-secondary;
        }
    }

    .prompt {
        display: flex;
        flex-direction: column;
    }

    .prompt-config-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
    }
</style>
