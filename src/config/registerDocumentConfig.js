import FeatureItemA5e from '../documents/item/feature';
import ObjectItemA5e from '../documents/item/object';
import OriginItemA5e from '../documents/item/origin';

export default function registerDocumentConfig(A5E) {
  A5E.Item = {
    documentClasses: {
      feature: FeatureItemA5e,
      object: ObjectItemA5e,
      background: OriginItemA5e,
      culture: OriginItemA5e,
      destiny: OriginItemA5e,
      heritage: OriginItemA5e
    }
  };
}
