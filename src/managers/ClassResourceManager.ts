interface ClassResource {
  name: string;
  reference: { [level: number]: string | number };
  recovery: string;
  slug?: string;
  type: 'number' | 'dice' | 'string';
}

export default class ClassResourceManager extends Map<string, ClassResource> {
  private item: typeof Item;

  constructor(item: typeof Item) {
    super();

    this.item = item;

    // Initialize the class resources
    const classResourceData: ClassResource[] = this.item.system.resources ?? [];
    classResourceData.forEach((data: ClassResource) => {
      const classResource = data;
      const slug = classResource.slug || classResource.name.slugify();
      // const isValid = this.validateResource(classResource);
      // TODO: Class Documents - Clean up the resource data if it's invalid and try again

      this.set(slug, classResource);
    });
  }

  validateResource(resource: ClassResource): boolean {
    const warnings: string[] = [];

    Object.values(resource.reference ?? {}).forEach((value) => {
      if (resource.type === 'number' && typeof value !== 'number') {
        warnings.push(`Resource ${resource.name} reference value must be a number`);
      }

      if (resource.type === 'dice' && typeof value !== 'number') {
        warnings.push(`Resource ${resource.name} reference value must be a number`);
      }

      if (resource.type === 'string' && typeof value !== 'string') {
        warnings.push(`Resource ${resource.name} reference value must be a string`);
      }
    });

    if (warnings.length > 0) {
      ui.notifications.warn(warnings.join('<br>'));
      return false;
    }

    return true;
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
