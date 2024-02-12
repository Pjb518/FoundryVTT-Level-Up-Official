declare const CONFIG: any;
declare const CONST: any;

declare const Actor: any;
declare const ActiveEffect: any;
declare const Item: any;
declare const Roll: any;
declare const Token: any;

declare const DocumentSheetConfig: any;
declare const TokenDocument: any;

declare const foundry: {
  CONST: any;
  abstract: any;
  config: any;
  data: any;
  documents: any;
  packages: any;
  utils: Utils;
};

declare const canvas: any;
declare const game: any;
declare const ui: any;
declare const warpgate: any;

declare function fromUuid(uuid: string, options: any = {}): Promise<any>;
declare function fromUuidSync(uuid: string, options: any = {}): any;
