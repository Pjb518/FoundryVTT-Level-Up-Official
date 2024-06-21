import type ClassItemA5e from '../documents/item/class';

import getDeterministicBonus from '../dice/getDeterministicBonus';

interface NumberClassResource {
  name: string;
  reference: { [level: number]: number };
  recovery: string;
  slug: string;
  type: 'number';
}

interface DiceClassResource {
  name: string;
  reference: { [level: number]: { number: number, faces: number, modifier: string } };
  slug: string;
  type: 'dice';

  convertFromString(formula: string): { number: number, faces: number, modifier: string };
  getDie(level: number): string;
  getFormula(level: number): string;
}

interface StringClassResource {
  name: string;
  reference: { [level: number]: string };
  recovery: string;
  slug: string;
  type: 'string';
}

type ClassResource = NumberClassResource | DiceClassResource | StringClassResource;

export default class ClassResourceManager extends Map<string, ClassResource> {
  private item: ClassItemA5e;

  rollData: Record<string, number | string> = {};

  constructor(item: ClassItemA5e) {
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

      let value: number | string | null = null;

      if (resource.type === 'number') {
        if (typeof rawValue === 'number') value = rawValue;
        else value = parseInt(rawValue as string, 10);
      } else if (resource.type === 'dice') {
        value = resource.getFormula(level);
      } else if (resource.type === 'string') {
        try {
          // TODO: Class Resources- Maybe use actor rollData here
          value = getDeterministicBonus(rawValue as string, this.item.getRollData());
        } catch (e) {
          value = rawValue as string;
        }
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

    // @ts-ignore
    if (!data?.type) data.type = 'number';
    if (data.type !== 'dice' && !data?.recovery) data.recovery = 'longRest';
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
