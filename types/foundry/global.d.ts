import * as abstract from './common/abstract/module.d.mts';
import * as constants from './common/constants.d.mts';
import * as config from './common/config.d.mts';
import * as data from './common/data/data.d.mts';
import * as documents from './common/documents/_module.d.mts';
import * as utils from './common/utils/module.d.mts';

declare const CONFIG: config;
declare const CONST: constants;

declare const Actor: any;
declare const ActiveEffect: any;
declare const ChatMessage: any;
declare const Hooks: any;
declare const Item: any;
declare const Roll: any;
declare const Token: any;

declare const DocumentSheetConfig: any;
declare const TokenDocument: any;

declare const foundry: {
  CONST: constants;
  abstract: abstract;
  config: config;
  data: data;
  documents: documents;
  packages: any;
  utils: utils;
};

declare const canvas: any;
declare const game: any;
declare const ui: any;
declare const warpgate: any;

declare function fromUuid(uuid: string, options: any = {}): Promise<any>;
declare function fromUuidSync(uuid: string, options: any = {}): any;
