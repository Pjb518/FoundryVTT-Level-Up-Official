<script>
    import { getContext } from "svelte";

    import FormSection from "../components/FormSection.svelte";

    let { application } = getContext("#external");

    function onSubmit() {
        application.submit({
            rollTableName: rollTableName || "New RollTable",
        });
    }

    let rollTableName = "";
</script>

<section>
    <div>
        <FormSection heading="Rolltable Name">
            <input
                type="text"
                bind:value={rollTableName}
                placeholder="New Rolltable"
            />
        </FormSection>
    </div>

    <div class="u-flex u-justify-center">
        <button class="submit-button" on:click|preventDefault={onSubmit}>
            <i class="fa-solid fa-table-list" />
            Create Rolltable
        </button>
    </div>
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    .submit-button {
        background: #dddbd2;
        border: 1px solid var(--color-border-light-primary);
    }
</style>
