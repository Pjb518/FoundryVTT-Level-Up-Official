type DocumentImageOptions = {
  actionId?: string;
  type?: string;
};

export async function editDocumentImage(
  document: any,
  options = {} as DocumentImageOptions,
) {
  // Add support for tokenizer
  if (game.modules.get("vtta-tokenizer")?.active && !options.shiftKey) {
    if (["character", "npc"].includes(document.type)) {
      Tokenizer?.tokenizeActor(document);

      return null;
    }
  }

  const current =
    foundry.utils.getProperty(
      document,
      `system.actions.${options?.actionId}.img`,
    ) ?? document.img;

  const filePicker = new FilePicker({
    type: "image",
    current,
    callback: async (path) => {
      if (options?.actionId) {
        await document.update({
          [`system.actions.${options?.actionId}.img`]: path,
        });
      } else {
        await document.update({ img: path });
      }
    },
  });

  return filePicker.browse();
}
