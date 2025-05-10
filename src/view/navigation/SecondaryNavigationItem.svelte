<script lang="ts">
    import type { Tab } from "./data.ts";

    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        currentTab: string;
        name: string;
        tab: Tab;
        onTabChange: (tabId: string) => void;
    };

    let { currentTab, name, tab, onTabChange }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
    class="a5e-secondary-nav-list__item"
    class:a5e-secondary-nav-list__item--active={name === currentTab}
    onclick={() => onTabChange(name)}
>
    {localize(tab.label || "")}
</li>
