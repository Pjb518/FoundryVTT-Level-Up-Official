<template>
  <div class="u-flex u-flex-col u-flex-grow u-gap-md">
    <editor-menu-bar :editor="editor" />

    <editor-content
      :editor="editor"
      class="u-border u-border-gray u-flex u-flex-col u-flex-grow u-rounded"
    />
  </div>
</template>

<script>
import { onBeforeUnmount, ref } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";

import EditorMenuBar from "./partials/EditorMenuBar.vue";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

export default {
  components: {
    EditorMenuBar,
    EditorContent,
    StarterKit,
    TextAlign,
  },
  props: {
    editable: { type: Boolean, default: true },
    modelValue: { type: String, default: "" },
  },
  setup(props, context) {
    const modelValue = ref(props.modelValue);

    const editor = new Editor({
      editorProps: {
        attributes: {
          class: "u-flex u-flex-col u-flex-grow u-p-md",
        },
      },
      extensions: [
        StarterKit.configure({
          history: false,
          horizontalRule: {
            HTMLAttributes: {
              class: "a5e-rule u-my-md",
            },
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: modelValue.value,
      onUpdate: () => {
        context.emit("update:modelValue", editor.getHTML());
      },
    });

    onBeforeUnmount(() => {
      editor.destroy();
    });

    return {
      editor,
    };
  },
};
</script>
