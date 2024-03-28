interface ClassResource {
  name: string;
  reference: { [level: number]: string | number };
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
      const slug = classResource.name.slugify();
      // const isValid = this.validateResource(classResource);
      // TODO: Clean up the resource data if it's invalid and try again

      this.set(slug, classResource);
    });
  }

  validateResource(resource: ClassResource): boolean {
    const warnings: string[] = [];

    Object.values(resource.reference ?? {}).forEach((value) => {
      if (resource.type === 'number' && typeof value !== 'number') {
        warnings.push(`Resource ${resource.name} reference value must be a number`);
      }

      if (resource.type === 'dice' && typeof value !== 'string') {
        warnings.push(`Resource ${resource.name} reference value must be a string`);
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

  async add(data: ClassResource) {
    delete data.slug;

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
        .filter((resource: ClassResource) => resource.name.slugify() !== slug)
    });
  }

  async removeAll() {
    await this.item.update({
      'system.resources': []
    });
  }
}
