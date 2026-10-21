<script lang="ts">
  import ColorPicker from "svelte-awesome-color-picker";

  import Section from "#view/snippets/Section.svelte";

  import type { ThemeSettings } from "../../settings/ThemeSettings.svelte.ts";

  type Props = {
    config: ThemeSettings.Config;
    fields: any[];
    dialog: ThemeSettings;
  };

  function getColors() {
    return fields.reduce((acc, data) => {
      if (data.field instanceof foundry.data.fields.ColorField) {
        acc.push({ ...data, value: currentTheme[data.key].toString() });
      }

      return acc;
    }, []);
  }

  function saveSettings() {
    const updatedTheme = foundry.utils.deepClone(currentTheme);

    // Update colors
    colors.forEach((color) => {
      updatedTheme[color.key] = color.value;
    });

    // Update settings
    game.settings.set("a5e", "themeSettings", {
      currentTheme: currentThemeId,
      themes: {
        ...config.themes,
        [currentThemeId]: updatedTheme,
      },
    });

    console.log("A5E | Updated theme settings");
  }

  function resetTheme() {}

  let { config, fields, dialog }: Props = $props();

  const VAR_MAPPINGS = dialog.VAR_MAPPINGS;

  let currentThemeId = $derived(config.currentTheme);
  let currentTheme = $derived(config.themes[currentThemeId ?? "default"]);

  let colors = $state(getColors());
</script>

<main class="a5e-theme-sheet">
  <header class="a5e-theme-sheet__header">
    <h3>Current Theme: {currentThemeId.capitalize()}</h3>

    <button
      type="button"
      class="a5e-button a5e-button--transparent"
      aria-label="Reset to Defaults"
      data-tooltip="Reset to Defaults"
      data-tooltip-direction="UP"
      onclick={() => resetTheme()}
    >
      <i class="fa-solid fa-arrow-rotate-left"></i>
    </button>
  </header>

  <div class="a5e-theme-sheet__settings">
    <Section heading="Color Selection">
      {#each colors as colorField}
        <div class="a5e-theme-sheet__colors__color">
          <ColorPicker
            label={colorField.label}
            hex={colorField.value}
            position="fixed"
            onInput={(event) => {
              colorField.value = event.hex;
            }}
          />

          <button
            type="button"
            class="a5e-button a5e-button--transparent"
            aria-label="Reset {colorField.label}"
            data-tooltip="Reset {colorField.label}"
            data-tooltip-direction="UP"
            onclick={() => (colorField.value = colorField.field.initial)}
          >
            <i class="fa-solid fa-arrow-rotate-left"></i>
          </button>
        </div>
      {/each}
    </Section>
  </div>

  <footer class="a5e-theme-sheet__footer">
    <button
      class="a5e-button"
      type="button"
      aria-label="Save Settings"
      onclick={() => saveSettings()}
    >
      Save Settings
    </button>
  </footer>
</main>

<style lang="scss">
  .a5e-theme-sheet {
    display: grid;
    grid-template-areas:
      "header"
      "settings"
      "footer";
    grid-template-rows: min-content minmax(0, 1fr) min-content;

    gap: var(--a5e-spacing-lg);
    height: 80vh;

    &__header {
      grid-area: header;

      display: flex;
      gap: var(--a5e-spacing-md);
    }

    &__settings {
      grid-area: settings;

      overflow-y: auto;
    }

    &__colors {
      &__color {
        display: flex;
        gap: var(--a5e-spacing-md);
        align-items: center;
      }
    }

    &__footer {
      grid-area: footer;
    }
  }
</style>
