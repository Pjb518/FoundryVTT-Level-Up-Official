export default async function editDocumentImage(document) {
  // Add support for tokenizer
  if (game.modules.get('vtta-tokenizer')?.active) {
    if (['character', 'npc'].includes(document.type)) {
      // eslint-disable-next-line no-undef
      Tokenizer?.tokenizeActor(document);

      return null;
    }
  }

  const current = document.img;
  const filePicker = new FilePicker({
    type: 'image',
    current,
    callback: async (path) => {
      await document.update({ img: path });
    }
  });

  return filePicker.browse();
}
