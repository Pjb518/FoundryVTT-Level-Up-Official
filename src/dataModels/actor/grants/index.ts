import ActorBaseGrant from './ActorBaseGrant';

import ActorBonusGrant from './ActorBonusGrant';
import { ActorFeatureGrant, ActorItemGrant } from './ActorDocumentGrant';
import ActorExertionGrant from './ActorExertionGrant';
import ActorExpertiseDiceGrant from './ActorExpertiseDiceGrant';
import ActorProficiencyGrant from './ActorProficiencyGrant';
import ActorRollOverrideGrant from './ActorRollOverrideGrant';
import ActorSkillSpecialtyGrant from './ActorSkillSpecialtyGrant';
import ActorTraitGrant from './ActorTraitGrant';

export default {
  base: ActorBaseGrant,

  bonus: ActorBonusGrant,
  feature: ActorFeatureGrant,
  item: ActorItemGrant,
  exertion: ActorExertionGrant,
  expertiseDice: ActorExpertiseDiceGrant,
  proficiency: ActorProficiencyGrant,
  rollOverride: ActorRollOverrideGrant,
  skillSpecialty: ActorSkillSpecialtyGrant,
  trait: ActorTraitGrant
};
