export default async function editDocumentImage(document, options = {}) {
  // Add support for tokenizer
  if (game.modules.get('vtta-tokenizer')?.active) {
    if (['character', 'npc'].includes(document.type)) {
      // eslint-disable-next-line no-undef
      Tokenizer?.tokenizeActor(document);

      return null;
    }
  }

  const current = foundry.utils.getProperty(document, `system.actions.${options?.actionId}.img`)
    ?? document.img
    ?? document.icon;

  const filePicker = new FilePicker({
    type: 'image',
    current,
    callback: async (path) => {
      if (options?.actionId) {
        await document.update({ [`system.actions.${options?.actionId}.img`]: path });
      } else if (options?.type === 'effect') {
        await document.update({ icon: path });
      } else {
        await document.update({ img: path });
      }
    }
  });

  return filePicker.browse();
}
