<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
</script>

<p>
    There is a <a
        href="https://preview.drivethrurpg.com/en/browse?ruleSystem=1000104&?affiliate_id=1388381"
        target="_blank">huge amount of 3PP material available for A5e</a
    >, and we've worked hard to forge relationships with third-party publishers
    to ensure that all of this great content is supported in the A5e system.
    Much of it is even included in the system by default.
</p>

<p>
    For content that isn't integrated into the system, we provide modules that
    are either sold by the publisher as standalone products or included for free
    when you purchase the original content. We've provided a handy list of these
    products in the <button
        class="false-link"
        on:click={() => dispatch("change-tab", 1)}
    >
        Premium Content
    </button>
    tab. You can also find a list of all the modules available for A5e, both free
    and premium, on
    <a
        href="https://github.com/Pjb518/FoundryVTT-Level-Up-Official/wiki/Modules"
        target="_blank">our GitHub repository</a
    >.
</p>

<p>
    We've also started producing exclusive modules for our Patreon supporters.
    You can find more information about this in the <button
        class="false-link"
        on:click={() => dispatch("change-tab", 2)}
    >
        Patreon Exclusive
    </button> tab.
</p>

<style lang="scss">
    .false-link {
        display: inline;
        height: unset;
        width: fit-content;
        line-height: unset;
        padding: 0;
        color: var(--color-text-hyperlink);
        text-decoration: underline;
        border: 0;
        background: transparent;
        cursor: pointer;

        &:hover {
            text-shadow: 0 0 8px var(--color-shadow-primary);
            box-shadow: none;
        }
    }
</style>
