export default function editImage(document) {
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
