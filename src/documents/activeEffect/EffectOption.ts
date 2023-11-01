type EffectOptionOptions = {
  modes?: any[];
  options?: any[];
  phase?: 'afterDerived' | 'applyAEs';
  type?: string;
};

export default class EffectOption {
  effectKey: string;

  label: string;

  modes: any[];

  options: any[];

  phase: 'afterDerived' | 'applyAEs';

  sampleValue: any;

  type: string;

  constructor(
    effectKey: string,
    sampleValue: any,
    options: EffectOptionOptions = {
      modes: [],
      options: [],
      phase: 'afterDerived',
      type: ''
    }
  ) {
    this.effectKey = effectKey;
    this.label = CONFIG.A5E.effectsKeyLocalizations?.[effectKey] ?? effectKey;
    this.sampleValue = sampleValue;

    this.modes = options.modes ?? [];
    this.options = options.options ?? [];
    this.phase = options.phase ?? 'afterDerived';
    this.type = options.type ?? 'DEFAULT';
  }
}
