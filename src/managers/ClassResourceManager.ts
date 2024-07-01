import type ArchetypeItemA5e from '../documents/item/archetype';
import type ClassItemA5e from '../documents/item/class';

import getDeterministicBonus from '../dice/getDeterministicBonus';

interface ClassResource {
  name: string;
  reference: { [level: number]: string };
  recovery: string;
  slug: string;
}

export default class ClassResourceManager extends Map<string, ClassResource> {
  private item: ClassItemA5e | ArchetypeItemA5e;

  rollData: Record<string, number | string> = {};

  constructor(item: ClassItemA5e | ArchetypeItemA5e) {
    super();

    this.item = item;

    // Initialize the class resources
    const classResourceData: ClassResource[] = this.item.system.resources ?? [];
    classResourceData.forEach((data: ClassResource) => {
      const classResource = data;
      const slug = classResource.slug || classResource.name.slugify({ strict: true });

      this.set(slug, classResource);
    });

    // Prepare level based resources
    this.prepareResources();
  }

  prepareResources() {
    let level: number;

    if (this.item.type === 'class') {
      // @ts-expect-error  This is correct just need to update this when the types are fixed
      level = this.item.system.classLevels;
    } else {
      const cls = (this.item as ArchetypeItemA5e).class;
      if (!cls) return;

      level = cls.system.classLevels;
    }

    [...this.entries()].forEach(([slug, resource]) => {
      const rawValue = resource.reference?.[level] || '';

      let value: number | string | null = null;

      try {
        const doc = this.item.isEmbedded ? this.item.parent ?? this.item : this.item;

        value = getDeterministicBonus(
          rawValue as string,
          // TODO: Types - Remove when types are fixed
          // @ts-ignore
          doc.getRollData(this.item),
          { strict: true }
        );
      } catch (e) {
        value = rawValue as string;
      }

      if (!value) value = 0;
      this.rollData[slug] = value;
    });
  }

  // @ts-ignore
  async add(data: ClassResource = {}) {
    if (!data?.name) {
      const count = [...this]
        .reduce((acc, [, { name }]) => (name === 'New Resource' ? acc + 1 : acc), 0);

      if (count > 0) data.name = `New Resource ${count + 1}`;
      else data.name = 'New Resource';
    }

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
        .filter((
          resource: ClassResource
        ) => resource.slug || resource.name.slugify({ strict: true }) !== slug)
    });
  }

  async removeAll() {
    await this.item.update({
      'system.resources': []
    });
  }
}
