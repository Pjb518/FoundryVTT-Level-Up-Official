type EffectOptionOptions = {
  modes?: any[];
  options?: any[];
  phase?: 'afterDerived' | 'applyAEs';
  type?: String;
};

export default class EffectOption {
  effectKey: String;

  label: String;

  modes: any[];

  options: any[];

  phase: 'afterDerived' | 'applyAEs';

  sampleValue: any;

  type: String;

  constructor(
    effectKey: String,
    sampleValue: any,
    options: EffectOptionOptions = {
      modes: [],
      options: [],
      phase: 'afterDerived',
      type: ''
    }
  ) {
    this.effectKey = effectKey;
    // @ts-ignore
    this.label = CONFIG.A5E.effectsKeyLocalizations?.[effectKey] ?? effectKey;
    this.sampleValue = sampleValue;

    this.modes = options.modes ?? [];
    this.options = options.options ?? [];
    this.phase = options.phase ?? 'afterDerived';
    this.type = options.type ?? 'DEFAULT';
  }
}
