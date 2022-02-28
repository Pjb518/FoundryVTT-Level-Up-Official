<template>
  <div class="u-flex u-flex-col u-flex-grow u-gap-md">
    <div class="u-flex u-gap-sm">
      <button
        v-for="level in 4"
        @click="editor.chain().focus().toggleHeading({ level }).run()"
        :key="`heading-${level}`"
        class="u-align-center u-flex u-px-lg u-pointer u-w-fit"
        :class="{
          'u-bg-green u-text-light': editor?.isActive('heading', { level }),
        }"
      >
        <i :class="`ri-h-${level} u-m-0`"></i>
      </button>

      <button
        @click="editor.chain().focus().toggleBold().run()"
        class="u-align-center u-flex u-px-lg u-pointer u-w-fit"
        :class="{ 'u-bg-green u-text-light': editor?.isActive('bold') }"
      >
        <i class="ri-bold u-m-0"></i>
      </button>

      <button
        @click="editor.chain().focus().toggleItalic().run()"
        class="u-align-center u-flex u-px-lg u-pointer u-w-fit"
        :class="{ 'u-bg-green u-text-light': editor?.isActive('italic') }"
      >
        <i class="ri-italic u-m-0"></i>
      </button>

      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        class="u-align-center u-flex u-px-lg u-pointer u-w-fit"
        :class="{ 'u-bg-green u-text-light': editor?.isActive('bulletList') }"
      >
        <i class="ri-list-unordered u-m-0"></i>
      </button>

      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        class="u-align-center u-flex u-px-lg u-pointer u-w-fit"
        :class="{ 'u-bg-green u-text-light': editor?.isActive('orderedList') }"
      >
        <i class="ri-list-ordered u-m-0"></i>
      </button>
    </div>

    <editor-content
      :editor="editor"
      class="u-border u-border-gray u-flex u-flex-col u-flex-grow u-rounded"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";

import StarterKit from "@tiptap/starter-kit";

export default {
  components: {
    EditorContent,
    StarterKit,
  },

  props: { modelValue: { type: String, default: "" } },
  data() {
    return {
      editor: null,
    };
  },

  watch: {
    modelValue(value) {
      const isSame = this.editor.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      editorProps: {
        attributes: {
          class: "u-flex u-flex-col u-flex-grow u-p-md",
        },
      },
      extensions: [
        StarterKit.configure({
          history: false,
        }),
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit("update:modelValue", this.editor.getHTML());
      },
    });
  },

  beforeUnmount() {
    this.editor.destroy();
  },
};
</script>
