<script>
    import { getContext } from "svelte";

    import CoreStats from "./CoreStats.svelte";
    import Level from "./Level.svelte";

    import updateDocumentDataFromField from "../../utils/updateDocumentDataFromField";

    const actor = getContext("actor");
</script>

<header class="sheet-header">
    <section class="sheet-header-top">
        <section class="sheet-header-top-left">
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

            <!-- {#if $actor.type === "character"}
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
            {/if} -->
        </section>

        <section>
            <Level />
        </section>
    </section>

    <CoreStats />
</header>

<style>
    .sheet-header {
        display: flex;
        flex-direction: column;
        height: fit-content;
        gap: 0.5rem;
        padding: 0.75rem;
        padding-bottom: 1.75rem;
        border-bottom: 1px solid #ccc;
    }

    .sheet-header-top {
        display: flex;
        width: 100%;
    }

    .sheet-header-top-left {
        display: flex;
        flex-grow: 1;
        align-items: center;
    }
</style>
