export default function getCheckNotesData() {
  const { fields } = foundry.data;
  return {
    title: new fields.StringField({ required: true, initial: '' }),
    content: new fields.HTMLField({ required: true, initial: '' })
  };
}
