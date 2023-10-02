/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class BonfireActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as attribute modifiers rather than attribute scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.bonfire || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareActorData(actorData);
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  _prepareActorData(actorData) {
    const systemData = actorData.system;
    systemData.vitality.value = systemData.vitality.max - systemData.vitality.damage;
    systemData.stress.value = systemData.stress.max - systemData.stress.damage;
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through attribute scores, and add their modifiers to our sheet output.
    for (let [key, attribute] of Object.entries(systemData.attributes)) {
      // Calculate the modifier using d20 rules.
      if (attribute.value < 10) {
        attribute.mod = Math.floor((attribute.value - 10) / 2);
        if (attribute.value <= 2) {
          attribute.mod--;
        }
      }
      else if (attribute.value > 10) {
        attribute.mod = Math.ceil((attribute.value - 10) / 2);
        if (attribute.value === 17 || attribute.value >= 19) {
          attribute.mod--;
        }
      }
      else {
        attribute.mod = 0;
      }

      if(systemData.integrity.value <= 5) {
        systemData.gritDice.dice = `N/A`;
      }
      else {
        var gridDiceVal = 4;
        if(systemData.integrity.value > 10){ 
          gridDiceVal = 6;
        }
        if(systemData.integrity.value > 15){ 
          gridDiceVal = 8;
        }
        if(systemData.integrity.value > 20){ 
          gridDiceVal = 10;
        }
        if(systemData.race.toLowerCase() === 'human'){ 
          gridDiceVal += 2;
        }
        systemData.gritDice.dice = `D${gridDiceVal}`;
      }
  
      if(systemData.vitality.damage > 0) {
        systemData.vitality.status = 'Hurt';
      }
      if(systemData.vitality.damage > Math.ceil(systemData.vitality.max / 4)) {
        systemData.vitality.status = 'Bloodied';
      }
      if(systemData.vitality.damage > Math.floor((systemData.vitality.max / 4) * 2)) {
        systemData.vitality.status = 'Wounded';
      }
      if(systemData.vitality.damage > Math.floor((systemData.vitality.max / 4) * 3)) {
        systemData.vitality.status = 'Critical';
      }
  
      if(systemData.stress.damage > 0) {
        systemData.stress.status = 'Unsure';
      }
      if(systemData.stress.damage > Math.ceil(systemData.stress.max / 4)) {
        systemData.stress.status = 'Nervous';
      }
      if(systemData.stress.damage > Math.floor((systemData.stress.max / 4) * 2)) {
        systemData.stress.status = 'Shaken';
      }
      if(systemData.stress.damage > Math.floor((systemData.stress.max / 4) * 3)) {
        systemData.stress.status = 'Breaking';
      }
    }

    // Loop through attribute scores, and add their modifiers to our sheet output.
    for (let [key, skill] of Object.entries(systemData.skillSuites)) {
      // Calculate the modifier using d20 rules.
      switch (key) {
        case "athletics":
          skill.mod = Math.max(systemData.attributes.str.mod, systemData.attributes.con.mod);
          break;
        case "lore":
          skill.mod = systemData.attributes.int.mod
          break;
        case "streetwise":
          skill.mod = Math.max(systemData.attributes.will.mod, systemData.attributes.pre.mod);
          break;
        case "strategy":
          skill.mod = Math.max(systemData.attributes.will.mod, systemData.attributes.pre.mod);
          break;
        case "survival":
          skill.mod = Math.max(systemData.attributes.con.mod, systemData.attributes.will.mod);
          break;
        case "trades":
          skill.mod = Math.max(systemData.attributes.dex.mod, systemData.attributes.int.mod);
          break;
        case "weirdcraft":
          skill.mod = Math.max(systemData.attributes.int.mod, systemData.attributes.will.mod);
          break;
      }
    }
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    systemData.xp = (systemData.cr * systemData.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the attribute scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    if (data.skillSuites) {
      for (let [k, v] of Object.entries(data.skillSuites)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.level) {
      data.lvl = data.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

}