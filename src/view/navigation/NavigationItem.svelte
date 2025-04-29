<script lang="ts">
    import type { Tab } from "./data.ts";
    import { localize } from "#utils/localization/localize.ts";

    type Props = {
        currentTab: Tab;
        name: string;
        icon: string | undefined;
        label: string | undefined;
        onTabChange: (name: string) => void;
    };

    let { currentTab, name, icon, label, onTabChange }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<li
    class="a5e-nav-item {icon}"
    class:a5e-nav-item--active={name === currentTab.name}
    onclick={() => onTabChange(name)}
    data-tooltip={localize(label || name)}
    data-tooltip-direction="UP"
></li>
