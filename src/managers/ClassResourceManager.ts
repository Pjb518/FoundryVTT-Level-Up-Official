import getDeterministicBonus from '../dice/getDeterministicBonus';

interface ClassResource {
  name: string;
  reference: { [level: number]: string };
  recovery: string;
  slug?: string;
  type: 'number' | 'dice' | 'string';
}

export default class ClassResourceManager extends Map<string, ClassResource> {
  private item: typeof Item;

  rollData: Record<string, number> = {};

  constructor(item: typeof Item) {
    super();

    this.item = item;

    // Initialize the class resources
    const classResourceData: ClassResource[] = this.item.system.resources ?? [];
    classResourceData.forEach((data: ClassResource) => {
      const classResource = data;
      const slug = classResource.slug || classResource.name.slugify();

      this.set(slug, classResource);
    });

    // Prepare level based resources
    this.prepareResources();
  }

  prepareResources() {
    const level = this.item.system.classLevels;
    [...this.entries()].forEach(([slug, resource]) => {
      const rawValue = resource.reference?.[level] || '';

      let value: number | null = null;
      try {
        // TODO: Class Resources- Maybe use actor rollData here
        value = getDeterministicBonus(rawValue, this.item.getRollData());
      } catch (e) {
        ui.notifications.error(`Error parsing resource value for ${slug}: ${e}`);
      }

      if (value === null || value === undefined) return;
      this.rollData[slug] = value;
    });
  }

  // @ts-ignore
  async add(data: ClassResource = {}) {
    if (!data?.name) {
      const count = [...this].reduce((acc, [, { name }]) => (name === 'New Resource' ? acc + 1 : acc), 0);

      if (count > 0) data.name = `New Resource ${count + 1}`;
      else data.name = 'New Resource';
    }

    if (!data?.type) data.type = 'number';
    if (!data?.recovery) data.recovery = 'longRest';
    if (!data?.reference) data.reference = {};

    await this.item.update({
      'system.resources': [
        ...this.item.system.resources,
        data
      ]
    });
  }

  async remove(slug: string) {
    await this.item.update({
      'system.resources': this.item.system.resources
        .filter((resource: ClassResource) => resource.slug || resource.name.slugify() !== slug)
    });
  }

  async removeAll() {
    await this.item.update({
      'system.resources': []
    });
  }
}
