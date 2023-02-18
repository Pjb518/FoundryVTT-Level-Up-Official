<script>
    export let item;
</script>

<div class="action-buttons">
    <button
        class="action-button fas fa-cog"
        data-tooltip="A5E.ButtonToolTipConfigure"
        data-tooltip-direction="UP"
        on:click={() => item.configureItem()}
    />

    <button
        class="action-button fa-solid fa-clone"
        data-tooltip="A5E.ButtonToolTipDuplicate"
        data-tooltip-direction="UP"
        on:click={() => item.duplicateItem()}
    />

    <button
        class="action-button delete-button fas fa-trash"
        data-tooltip="A5E.ButtonToolTipDelete"
        data-tooltip-direction="UP"
        on:click={() => item.delete()}
    />
</div>

<style lang="scss">
    .action-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
        color: #999;
    }

    .action-button {
        padding: 0.25rem;
        background: none;
        border: 0;
        transition: all 0.15s ease-in-out;
        color: #999;

        &:hover,
        &:focus {
            color: #555;
            transform: scale(1.2);
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: #8b2525;
    }
</style>
