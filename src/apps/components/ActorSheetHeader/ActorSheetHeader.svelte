<script>
    import { getContext } from "svelte";

    import CoreStats from "./CoreStats.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
</script>

<header class="sheet-header">
    <div class="u-flex u-gap-xl">
        <div class="u-flex-grow">
            <input
                v-else
                type="text"
                name="name"
                value={$actor.name}
                class="a5e-input a5e-input--character-name"
                placeholder="Name"
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $actor,
                        target.name,
                        target.value
                    )}
            />
        </div>

        <!-- {#if $actor.type === "character"}
            <div class="u-flex u-text-medium">
                <input
                    class="a5e-input a5e-input--classes"
                    type="text"
                    name="system.details.classes"
                    value={$actor.system.details.classes}
                    placeholder="Class"
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $actor,
                            target.name,
                            target.value
                        )}
                />
            </div>
        {/if} -->
    </div>

    <CoreStats />
</header>

<style>
    .sheet-header {
        display: flex;
        padding: 1rem;
        padding-bottom: 0.75rem;
        gap: 1rem;
        height: fit-content;
        flex-direction: column;
    }
</style>
