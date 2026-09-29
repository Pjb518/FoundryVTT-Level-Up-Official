<script lang="ts">
  import { getContext, onMount } from "svelte";

  type Props = {
    applicationType?: string;
    content: string;
    config?: {
      name?: string;
      language?: "javascript" | "json";
      indent?: number;
    };
    document: any;
    field: string;
    onSave?: () => void;
    [key: string]: any;
  };

  /** Merge config with defaults */
  function getConfig() {
    const c = {
      name: `editor-${foundry.utils.randomID()}` || config.name,
      language: config.language || "javascript",
      indent: config.indent ?? 2,
      value: content,
    };

    if (c.language === "json") {
      c.value = foundry.data.validators.isJSON(content)
        ? JSON.stringify(JSON.parse(content), null, c.indent)
        : JSON.stringify(content, null, c.indent);
    }

    return c;
  }

  /** Handle Saving */
  function handleSave() {
    const codeMirrorElement =
      codeMirrorContainerEl?.querySelector("code-mirror");
    const currentContent = codeMirrorElement?.value ?? content;

    try {
      let updatedContent: string;

      if (mergedConfig.language === "json") {
        updatedContent = JSON.stringify(currentContent, null, config.indent);
      } else {
        new Function(`return (async function() { ${currentContent} })`)();
      }
      document.update({ [`system.${field}`]: currentContent });
      onSave?.();

      ui.notifications?.info("Saved successfully");
    } catch (error) {
      console.log(error);
      ui.notifications?.error(
        `Invalid ${mergedConfig.language}: ${error.message}`,
      );

      return;
    }
  }

  /** Add support for Ctrl+S */
  function onEditorActivation(node: HTMLElement) {
    node.addEventListener("keydown", (e) => {
      if (
        game.keyboard.isModifierActive(
          // @ts-expect-error
          foundry.helpers.interaction.KeyboardManager.MODIFIER_KEYS.CONTROL,
        ) &&
        e.key === "s"
      ) {
        handleSave();
      }
    });
  }

  let {
    applicationType = "sheet",
    content,
    document,
    field,
    config = {},
    onSave,
    ...rest
  }: Props = $props();

  let codeMirrorContainerEl: HTMLElement;
  let elem: any;

  let application: any = getContext(applicationType);

  const mergedConfig = getConfig();

  // Create Editor element and put it in the contents element.
  onMount(async () => {
    elem =
      foundry.applications.elements.HTMLCodeMirrorElement.create(mergedConfig);

    codeMirrorContainerEl.innerHTML = elem.outerHTML;
  });
</script>

<section class="a5e-code-editor">
  <div class="a5e-code-editor__wrapper">
    <div
      id="a5e-code-mirror-{mergedConfig.name}"
      class={rest.class ?? ""}
      bind:this={codeMirrorContainerEl}
      use:onEditorActivation
    ></div>
  </div>

  <button
    type="button"
    onclick={(e) => {
      e.preventDefault();
      handleSave();
    }}
  >
    Save Macro
  </button>
</section>

<style lang="scss">
  .a5e-code-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: var(--a5e-code-editor-height, 25rem);
    min-height: 0;
  }

  .a5e-code-editor__wrapper {
    flex: 1 1 auto;
    min-height: 0;
    min-width: 0;

    & > div {
      height: 100%;
      min-height: 0;

      :global(code-mirror) {
        height: 100%;
        min-height: 0;
      }
    }
  }
</style>
