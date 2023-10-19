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
    this._prepareAttacks(actorData);
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

      if (systemData.integrity.value <= 5) {
        systemData.gritDice.dice = `N/A`;
      }
      else {
        var gridDiceVal = 4;
        if (systemData.integrity.value > 10) {
          gridDiceVal = 6;
        }
        if (systemData.integrity.value > 15) {
          gridDiceVal = 8;
        }
        if (systemData.integrity.value > 20) {
          gridDiceVal = 10;
        }
        if (systemData.race.toLowerCase() === 'human') {
          gridDiceVal += 2;
        }
        systemData.gritDice.dice = `D${gridDiceVal}`;
      }

      if (systemData.vitality.damage > 0) {
        systemData.vitality.status = 'Hurt';
      }
      if (systemData.vitality.damage > Math.ceil(systemData.vitality.max / 4)) {
        systemData.vitality.status = 'Bloodied';
      }
      if (systemData.vitality.damage > Math.floor((systemData.vitality.max / 4) * 2)) {
        systemData.vitality.status = 'Wounded';
      }
      if (systemData.vitality.damage > Math.floor((systemData.vitality.max / 4) * 3)) {
        systemData.vitality.status = 'Critical';
      }

      if (systemData.stress.damage > 0) {
        systemData.stress.status = 'Unsure';
      }
      if (systemData.stress.damage > Math.ceil(systemData.stress.max / 4)) {
        systemData.stress.status = 'Tense';
      }
      if (systemData.stress.damage > Math.floor((systemData.stress.max / 4) * 2)) {
        systemData.stress.status = 'Shaken';
      }
      if (systemData.stress.damage > Math.floor((systemData.stress.max / 4) * 3)) {
        systemData.stress.status = 'Breaking';
      }
    }

    // Loop through attribute scores, and add their modifiers to our sheet output.
    for (let [key, skill] of Object.entries(systemData.skillSuites)) {
      // Calculate the modifier using d20 rules.
      switch (key) {
        case "athletics":
          skill.mod = Math.min(systemData.attributes.str.mod, systemData.attributes.con.mod);
          break;
        case "lore":
          skill.mod = systemData.attributes.int.mod
          break;
        case "streetwise":
          skill.mod = Math.min(systemData.attributes.will.mod, systemData.attributes.pre.mod);
          break;
        case "strategy":
          skill.mod = Math.min(systemData.attributes.will.mod, systemData.attributes.pre.mod);
          break;
        case "survival":
          skill.mod = Math.min(systemData.attributes.con.mod, systemData.attributes.will.mod);
          break;
        case "trades":
          skill.mod = Math.min(systemData.attributes.dex.mod, systemData.attributes.int.mod);
          break;
        case "weirdcraft":
          skill.mod = Math.min(systemData.attributes.int.mod, systemData.attributes.will.mod);
          break;
      }
    }

    for (let [key, combatSkill] of Object.entries(systemData.combatSkills)) {
      for (let [key, advancedCombatSkill] of Object.entries(combatSkill.advancedCombatSkills)) {
        advancedCombatSkill.cost = (advancedCombatSkill.value * 3) + advancedCombatSkill.baseCost - systemData.martialAdepts;
      }
    }

    var totalCRPRequired = 0;

    for (var i = 0; i < systemData.level.value; i++) {
      totalCRPRequired += 50 + (3 * (i + 1));
    }

    systemData.crp.toLevel = totalCRPRequired - systemData.crp.spent;
    systemData.crp.totalExpenditure = actorData.items.filter(item => item.type === 'expenditure').reduce((sum, obj) => sum + obj.system.amount, 0);
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;
  }

  _prepareAttacks(actorData) {
    const systemData = actorData.system;


    var combatStatMods = {
      attack: 0,
      defense: 0,
      initiative: 0,
      damage: 0,
      recovery: 0
    }

    if (actorData.type === 'character') {
      combatStatMods.attack = CONFIG.BONFIRE.combatStatMods.dexAtk[systemData.attributes.dex.value] + CONFIG.BONFIRE.combatStatMods.intAtk[systemData.attributes.int.value];
      combatStatMods.defense = CONFIG.BONFIRE.combatStatMods.dexDef[systemData.attributes.dex.value] + CONFIG.BONFIRE.combatStatMods.willDef[systemData.attributes.will.value];
      combatStatMods.initiative = CONFIG.BONFIRE.combatStatMods.dexInit[systemData.attributes.dex.value] + CONFIG.BONFIRE.combatStatMods.willInit[systemData.attributes.will.value];
      combatStatMods.damage = CONFIG.BONFIRE.combatStatMods.strDam[systemData.attributes.str.value];
      combatStatMods.recovery = CONFIG.BONFIRE.combatStatMods.strRec[systemData.attributes.str.value];
    }

    systemData.combatStatMods = combatStatMods;

    const attacks = [];

    const stengthRecoverySizes = {
      'small': 1,
      'medium': 2,
      'large': 3,
      'huge': 4,
    };
    const minRecovery = {
      'crushing': {
        'small': 4,
        'medium': 5,
        'large': 6,
        'huge': 6
      },
      'piercing': {
        'small': 2,
        'medium': 2,
        'large': 2,
        'huge': 2
      },
      'slashing': {
        'small': 3,
        'medium': 3,
        'large': 3,
        'huge': 4
      },
    };
    for (const weapon of actorData.items.filter(item => item.type === 'weapon' && item.system.equipped)) {
      let attackBonus = combatStatMods.attack + weapon.system.attack + weapon.system.characterBonuses.attack + systemData.attack.value;
      let damageBonus = weapon.system.characterBonuses.damage + systemData.damage.value;

      let recoveryBonus = combatStatMods.recovery * stengthRecoverySizes[weapon.system.size] + weapon.system.recovery + weapon.system.characterBonuses.recovery + systemData.recovery.value;
      let recovery = weapon.system.recovery - recoveryBonus;
      let defense = systemData.defense.value + combatStatMods.defense + systemData.defense.value;
      let parry = 0
      let dr = systemData.dr.value;
      let diceDR = systemData.diceDr.value;
      let parryDR = '2/d';
      let name = weapon.name;
      let measure = weapon.system.measure;
      let damageFormula = weapon.system.damageFormula;
      let initiative = systemData.init.value + combatStatMods.initiative;
      let statDamage = 0;
      let flanks = systemData.flanks.value;
      let cover = systemData.cover.value;

      if (weapon.system.skillSuite !== 'ranged') {
        measure += systemData.measure.value;
        statDamage = combatStatMods.damage;
        parry = weapon.system.baseParry + weapon.system.characterBonuses.parry + systemData.parry.value;
      }

      if (actorData.type === 'character') {
        attackBonus += systemData.combatSkills[weapon.system.skillSuite].advancedCombatSkills.attack.value;
        damageBonus += Math.ceil(systemData.combatSkills[weapon.system.skillSuite]?.advancedCombatSkills.damage.value / 2);
        recoveryBonus += Math.ceil(systemData.combatSkills[weapon.system.skillSuite]?.advancedCombatSkills.recovery.value / 2);
        if (weapon.system.skillSuite !== 'ranged') {
          parry += (systemData.combatSkills[weapon.system.skillSuite]?.advancedCombatSkills.parry.value || 0);
        }
        if (systemData.shield.equipped && (weapon.system.size === 'small' || weapon.system.size === 'medium')) {
          parryDR = `${systemData.shield.diceDr}/d+${systemData.shield.dr}`;
          name = `${name} & ${systemData.shield.name}`;
          flanks += systemData.shield.flanks;
          cover += systemData.shield.cover;
        }
        if (systemData.armor.equipped) {
          dr += systemData.armor.dr;
          diceDR += systemData.armor.diceDr;
          initiative += systemData.armor.penalties.initiative.total;
        }
      }

      if (weapon.system.damageType === 'piercing') {
        damageFormula = `${this.calculatePiercingDamage(damageBonus, damageFormula)}+${statDamage}`;
      }
      else if (weapon.system.damageType === 'slashing') {
        damageFormula = `${this.calculateSlashingDamage(damageBonus, damageFormula)}+${statDamage}`;
      }
      else {
        damageFormula = `${damageFormula}+${damageBonus + statDamage}`
      }
      recovery = Math.max(recovery, weapon.system.minRecovery);
      attacks.push(
        {
          id: attacks.length,
          name: name,
          measure: measure,
          attack: `${weapon.system.formula}+${attackBonus}`,
          damage: damageFormula,
          damageType: weapon.system.damageType.charAt(0).toUpperCase(),
          recovery: recovery,
          initiative: initiative,

          defense: defense,
          defenseFormula: `1d20x+${defense}`,
          flanks: flanks,
          parry: parry,
          cover: cover,
          parryDR: parryDR,
          DR: `${diceDR}/d+${dr}`,
        }
      );
    }
    systemData.attacks = attacks;
  }

  extractDiceInfo(inputString) {
    const diceRegex = /(\d+)d(\d+)/g;
    const matches = inputString.match(diceRegex);
    const diceInfo = {};

    if (matches) {
      matches.forEach(match => {
        const [_, numberOfDice, numberOfFaces] = match.match(/(\d+)d(\d+)/);
        diceInfo[parseInt(numberOfFaces)] = parseInt(numberOfDice);
      });
      return diceInfo;
    } else {
      return null; // Return null if no dice information is found
    }
  }

  calculateSlashingDamage(value, damageFormula) {
    const formulaInfo = this.extractDiceInfo(damageFormula);

    let d4Count = 0;
    let currentDie = 0;

    let damageFormulaString = '';

    for (let i = 0; i < value; i++) {
      if (currentDie === 0) {
        currentDie = 3;
      }
      else if (currentDie === 3) {
        currentDie = 0;
        d4Count++;
      }
    }

    if (formulaInfo[4] || d4Count) {
      formulaInfo[4] = (formulaInfo[4] || 0) + d4Count;
    }


    if (currentDie !== 0) {
      formulaInfo[currentDie] = (formulaInfo[currentDie] || 0) + 1;
    }

    for (const numberOfFaces in formulaInfo) {
      if (damageFormulaString !== '') {
        damageFormulaString += '+';
      }
      damageFormulaString += `${formulaInfo[numberOfFaces]}d${numberOfFaces}x`;
    }

    return damageFormulaString;
  }

  calculatePiercingDamage(value, damageFormula) {
    const formulaInfo = this.extractDiceInfo(damageFormula);

    let d8Count = 0;
    let currentDie = 0;

    let damageFormulaString = '';

    for (let i = 0; i < value; i++) {
      if (currentDie === 0) {
        currentDie = 3;
      }
      else if (currentDie === 3) {
        currentDie = 4;
      }
      else if (currentDie === 4) {
        currentDie = 6;
      }
      else if (currentDie === 6) {
        currentDie = 0;
        d8Count++;
      }
    }

    if (formulaInfo[8] || d8Count) {
      formulaInfo[8] = (formulaInfo[8] || 0) + d8Count;
    }

    if (currentDie !== 0) {
      formulaInfo[currentDie] = (formulaInfo[currentDie] || 0) + 1;
    }

    for (const numberOfFaces in formulaInfo) {
      if (damageFormulaString !== '') {
        damageFormulaString += '+';
      }
      damageFormulaString += `${formulaInfo[numberOfFaces]}d${numberOfFaces}x`;
    }

    return damageFormulaString;
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