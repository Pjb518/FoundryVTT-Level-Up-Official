export default async function editDocumentImage(document, actionId = null) {
  // Add support for tokenizer
  if (game.modules.get('vtta-tokenizer')?.active) {
    if (['character', 'npc'].includes(document.type)) {
      // eslint-disable-next-line no-undef
      Tokenizer?.tokenizeActor(document);

      return null;
    }
  }

  const current = document?.actions?.[actionId]?.img ?? document.img;

  const filePicker = new FilePicker({
    type: 'image',
    current,
    callback: async (path) => {
      if (actionId) {
        await document.update({ [`system.actions.${actionId}.img`]: path });
      } else {
        await document.update({ img: path });
      }
    }
  });

  return filePicker.browse();
}
