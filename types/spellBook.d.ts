export interface SpellBookData {
  _id: string;
  name: string;
  default: boolean;
  img: string;
  slug: string;

  ability: string;
  disableSpellConsumers: boolean;
  showSpellPoints: boolean;
  showSpellSlots: boolean;
}

export interface SpellBookStats {
  ability: string;
  dc: number;
  mod: number;
}
