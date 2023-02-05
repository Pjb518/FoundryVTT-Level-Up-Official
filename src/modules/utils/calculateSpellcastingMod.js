export default function calculateSpellcastingMod(actorData){
    const { abilities, attributes } = actorData;

    const spellcastingAbility = attributes.spellcasting || 'int';

    return abilities[spellcastingAbility].mod

}