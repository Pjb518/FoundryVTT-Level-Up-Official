<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { GenericConfigDialog } from "#view/dialogs/initializers/GenericConfigDialog.svelte.ts";
  import CodeEditor from "./CodeEditor.svelte";

  type Props = {
    applicationType?: string;
    canPopOut?: boolean;
    content: string;
    config?: {
      name?: string;
      language?: "javascript" | "json";
      indent?: number;
    };
    heading?: string;
    document: any;
    field: string;
    onSave?: () => void;
    [key: string]: any;
  };

  /** convert to string */
  function convertToString(value: any, indent = 2) {
    return foundry.data.validators.isJSON(value)
      ? JSON.stringify(JSON.parse(value), null, indent)
      : JSON.stringify(value, null, indent);
  }

  /** Merge config with defaults */
  function getConfig() {
    const c = {
      name: `editor-${foundry.utils.randomID()}` || config.name,
      language: config.language || "javascript",
      indent: config.indent ?? 2,
      value: content,
    };

    if (c.language === "json") {
      c.value = convertToString(content, c.indent);
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
        updatedContent = convertToString(currentContent, mergedConfig.indent);
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

  /** Pop out Code Editor */
  async function popOutContainer() {
    const dialogData = {
      canPopOut: false,
      content: convertToString(content),
      config,
      document,
      field,
      heading,
      onSave,
      ...rest,
    };

    const options = {
      width: 500,
      height: 500,
      resizable: true,
    };

    const title = heading ? `Code Editor - ${heading}` : "Code Editor";

    const dialog = new GenericConfigDialog(
      document,
      title,
      CodeEditor,
      dialogData,
      options,
    );

    dialog.render(true);
    poppedOut = true;
    await dialog.promise;
    poppedOut = false;
  }

  let {
    applicationType = "sheet",
    canPopOut = true,
    content,
    document,
    field,
    heading,
    config = {},
    onSave,
    ...rest
  }: Props = $props();

  let codeMirrorContainerEl = $state<HTMLElement | undefined>();
  let poppedOut = $state(false);

  const mergedConfig = getConfig();
</script>

<section class="a5e-code-editor">
  {#if heading}
    <header class="a5e-code-editor__heading">
      <span>{heading}</span>
      {#if canPopOut}
        <button
          type="button"
          class="a5e-button a5e-button--transparent"
          aria-label="Pop out editor"
          data-tooltip="Pop out editor"
          data-tooltip-direction="UP"
          disabled={poppedOut}
          onclick={() => popOutContainer()}
        >
          <i class="fa-solid fa-picture-in-picture"></i>
        </button>
      {/if}
    </header>
  {/if}

  <div class="a5e-code-editor__wrapper">
    <div
      id="a5e-code-mirror-{mergedConfig.name}"
      class={rest.class ?? ""}
      bind:this={codeMirrorContainerEl}
      use:onEditorActivation
    >
      <code-mirror
        name={mergedConfig.name}
        language={mergedConfig.language}
        indent={mergedConfig.indent}
        disabled={poppedOut}
        value={mergedConfig.value}
      >
      </code-mirror>
    </div>
  </div>

  <button
    type="button"
    disabled={poppedOut}
    onclick={(e) => {
      e.preventDefault();
      handleSave();
    }}
  >
    Save {heading ?? "Macro"}
  </button>
</section>

<style lang="scss">
  .a5e-code-editor {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: var(--a5e-code-editor-height, 25rem);
    min-height: 0;

    &__heading {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    &__wrapper {
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
  }
</style>
