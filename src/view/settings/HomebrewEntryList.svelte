<script lang="ts">
    import { localize } from "#utils/localization/localize.ts";

    import FieldWrapper from "#view/snippets/FieldWrapper.svelte";
    import Tag from "#view/snippets/Tag.svelte";

    type Props = {
        entries?: Record<string, string>;
        open?: boolean;
        onAdd: (labels: string[]) => Promise<boolean> | boolean;
        onRemove: (key: string) => void;
    };

    let { entries = {}, open = false, onAdd, onRemove }: Props = $props();

    let value = $state("");

    async function save() {
        const labels = value
            .split(";")
            .map((label) => label.trim())
            .filter(Boolean);

        if (!labels.length) return;
        if (await onAdd(labels)) value = "";
    }
</script>

{#if open}
    <FieldWrapper hint="A5E.HintSeparateBySemiColon">
        <div class="homebrew-input">
            <input
                class="a5e-input"
                type="text"
                bind:value
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    save();
                }}
            />

            <button
                class="a5e-button"
                type="button"
                onclick={(e) => {
                    e.preventDefault();
                    save();
                }}
            >
                {localize("A5E.settings.homebrewAdd")}
            </button>
        </div>
    </FieldWrapper>
{/if}

{#if Object.keys(entries).length}
    <ul class="homebrew-entries">
        {#each Object.entries(entries) as [key, label] (key)}
            <Tag
                {label}
                value={key}
                showIcon
                icon="fa-solid fa-xmark"
                tooltipText={localize("A5E.settings.homebrewRemove")}
                onTagToggle={(key) => onRemove(key)}
            />
        {/each}
    </ul>
{/if}

<style lang="scss">
    .homebrew-input {
        display: flex;
        gap: 0.375rem;
        align-items: center;
    }

    .homebrew-entries {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        margin: 0;
        padding: 0;
        font-size: var(--a5e-xs-text);
        list-style: none;
    }
</style>
