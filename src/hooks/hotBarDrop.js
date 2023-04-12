// eslint-disable-next-line consistent-return
export default async function hotbarDrop(_, data, slot) {
  if (data.type === 'Item') {
    game.a5e.macros.createMacro(data, slot);
    return false;
  }
}
