<template>
  <div class="u-flex u-flex-wrap u-gap-sm">
    <editor-menu-button
      v-for="level in 4"
      :key="`heading-${level}`"
      :class="{
        'u-bg-green u-text-light': editor?.isActive('heading', { level }),
      }"
      :icon="`ri-h-${level}`"
      @click="editor.chain().focus().toggleHeading({ level }).run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('bold') }"
      icon="ri-bold"
      @click="editor.chain().focus().toggleBold().run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('italic') }"
      icon="ri-italic"
      @click="editor.chain().focus().toggleItalic().run()"
    />

    <editor-menu-button
      v-for="alignment in ['left', 'center', 'right']"
      :key="`editor-${alignment}`"
      :class="{
        'u-bg-green u-text-light': editor?.isActive({ textAlign: alignment }),
      }"
      :icon="`ri-align-${alignment}`"
      @click="editor.chain().focus().setTextAlign(alignment).run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('link') }"
      icon="ri-link-m"
      @click="setLink"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('link') }"
      icon="ri-link-unlink-m"
      @click="editor.chain().focus().unsetLink().run()"
    />

    <editor-menu-button icon="ri-image-fill" @click="addImage" />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('blockquote') }"
      icon="ri-double-quotes-l"
      @click="editor.chain().focus().toggleBlockquote().run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('bulletList') }"
      icon="ri-list-unordered"
      @click="editor.chain().focus().toggleBulletList().run()"
    />

    <editor-menu-button
      :class="{ 'u-bg-green u-text-light': editor?.isActive('orderedList') }"
      icon="ri-list-ordered"
      @click="editor.chain().focus().toggleOrderedList().run()"
    />

    <editor-menu-button
      icon="ri-separator"
      @click="editor.chain().focus().setHorizontalRule().run()"
    />
  </div>
</template>

<script>
import EditorMenuButton from "./EditorMenuButton.vue";

export default {
  components: { EditorMenuButton },
  props: { editor: Object },
  setup(props) {
    const editor = props.editor;

    function createExternalLink(url) {
      const containsProtocol = /^(http:\/\/)|(https:\/\/)/.test(url);

      if (!containsProtocol) return `https://${url}`;
      else return url;
    }

    async function addImage() {
      const path = await new Promise((resolve) => {
        const filepicker = new FilePicker({
          type: "image",
          callback: (path) => resolve(path),
          close: () => resolve(null),
        });

        filepicker.browse();
      });

      if (path) editor.chain().focus().setImage({ src: path }).run();
    }

    function setLink() {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);

      // cancelled
      if (url === null) return;

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: createExternalLink(url) })
        .run();
    }

    return {
      addImage,
      setLink,
    };
  },
};
</script>
