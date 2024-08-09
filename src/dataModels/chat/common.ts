const { fields } = foundry.data;

export const metadata = () => ({
  actorId: new fields.StringField({ required: true, nullable: false, initial: '' }),
  img: new fields.FilePathField({ categories: ['IMAGE'] }),
  name: new fields.StringField({ required: true, nullable: false, initial: '' })
});
