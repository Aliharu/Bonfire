import { skillSuiteField, advancedSkillField, resourceField, statField, traitField } from "./common-template.js";

const fields = foundry.data.fields;

class CommonActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    // Note that the return is just a simple object
    return {
      biography: new fields.HTMLField({ initial: "" }),
      vitality: new fields.SchemaField({
        damage: new fields.NumberField({ initial: 0 }),
        value: new fields.NumberField({ initial: 0 }),
        min: new fields.NumberField({ initial: 0 }),
        max: new fields.NumberField({ initial: 0 }),
      }),
      stress: new fields.SchemaField({
        damage: new fields.NumberField({ initial: 0 }),
        value: new fields.NumberField({ initial: 0 }),
        min: new fields.NumberField({ initial: 0 }),
        max: new fields.NumberField({ initial: 0 }),
      }),
      init: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      attack: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      defense: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      damage: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      dr: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      diceDr: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      parry: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      recovery: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      measure: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      cover: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      flanks: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      knockback: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      traumaThreshhold: statField(0),
      speed: new fields.SchemaField({
        crawl: new fields.NumberField({ initial: 2.5 }),
        walk: new fields.NumberField({ initial: 5 }),
        jog: new fields.NumberField({ initial: 10 }),
        run: new fields.NumberField({ initial: 15 }),
        sprint: new fields.NumberField({ initial: 20 }),
      }),
      size: new fields.StringField({ initial: "medium" }),
      traits: new fields.SchemaField({
        languages: traitField(),
      }),
    }
  }

  toPlainObject() {
    return {...this};
  }
}

export class CharacterData extends CommonActorData {
  static defineSchema() {
    // CharacterData inherits those resource fields
    const commonData = super.defineSchema();
    return {
      // Using destructuring to effectively append our additional data here
      ...commonData,
      level: new fields.SchemaField({
        value: new fields.NumberField({ initial: 1 }),
        primary: new fields.NumberField({ initial: 1 }),
        secondary: new fields.NumberField({ initial: 1 }),
      }),
      class: new fields.SchemaField({
        main: new fields.StringField({ initial: "" }),
        sub: new fields.StringField({ initial: "" }),
      }),
      attributes: new fields.SchemaField({
        str: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
        }),
        dex: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
        }),
        con: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
        }),
        int: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
        }),
        will: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
        }),
        pre: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
        }),
      }),
      skillSuites: new fields.SchemaField({
        athletics: skillSuiteField("Athletics"),
        lore: skillSuiteField("Lore"),
        streetwise: skillSuiteField("Streetwise"),
        strategy: skillSuiteField("Strategy"),
        survival: skillSuiteField("Survival"),
        trades: skillSuiteField("Trades"),
        weirdcraft: skillSuiteField("Weirdcraft")
      }),
      martialAdepts: new fields.NumberField({ initial: 0 }),
      skillAdepts: new fields.NumberField({ initial: 0 }),
      combatSkills: new fields.SchemaField({
        melee: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
          trained: new fields.BooleanField({ initial: false }),
          label: new fields.StringField({ initial: "Melee" }),
          advancedCombatSkills: new fields.SchemaField({
            attack: advancedSkillField("Attack", 7),
            damage: advancedSkillField("Damage", 7),
            recovery: advancedSkillField("Recovery", 7),
            parry: advancedSkillField("Parry", 7),
          }),
        }),
        ranged: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
          trained: new fields.BooleanField({ initial: false }),
          label: new fields.StringField({ initial: "Ranged" }),
          advancedCombatSkills: new fields.SchemaField({
            attack: advancedSkillField("Attack", 7),
            damage: advancedSkillField("Damage", 7),
            recovery: advancedSkillField("Recovery", 7),
          }),
        }),
        armor: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
          trained: new fields.BooleanField({ initial: false }),
          equipped: new fields.BooleanField({ initial: false }),
          label: new fields.StringField({ initial: "Armor" }),
          advancedCombatSkills: new fields.SchemaField({
            fatigue: advancedSkillField("Fatigue", 7),
            recovery: advancedSkillField("Recovery", 7),
            initiative: advancedSkillField("Initiative", 7),
          }),
        }),
        shield: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
          trained: new fields.BooleanField({ initial: false }),
          equipped: new fields.BooleanField({ initial: false }),
          label: new fields.StringField({ initial: "Shield" }),
          advancedCombatSkills: new fields.SchemaField({
            breakage: advancedSkillField("Breakage", 7),
            fatigue: advancedSkillField("Fatigue", 7),
            parry: advancedSkillField("Parry", 7),
          }),
        }),
        unarmed: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
          trained: new fields.BooleanField({ initial: false }),
          label: new fields.StringField({ initial: "Unarmed" }),
          advancedCombatSkills: new fields.SchemaField({
            damage: advancedSkillField("Damage", 7),
            grabEffectiveness: advancedSkillField("Effectiveness (Grab)", 5),
            pushEffectiveness: advancedSkillField("Effectiveness (Grab)", 5),
            throwEffectiveness: advancedSkillField("Effectiveness (Throw/Tackle)", 5),
            strikeEffectiveness: advancedSkillField("Effectiveness (Strike)", 5),
            breakEffectiveness: advancedSkillField("Effectiveness (Break Free)", 5),
          }),
        }),
      }),
      integrity: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      gritDice: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
        dice: new fields.StringField({ initial: "N/A" }),
      }),
      favor: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
        max: new fields.NumberField({ initial: 0 }),
      }),
      contactPoints: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      goals: new fields.StringField({ initial: "" }),
      crp: new fields.SchemaField({
        unspent: new fields.NumberField({ initial: 0 }),
        spent: new fields.NumberField({ initial: 0 }),
      }),
      race: new fields.StringField({ initial: "" }),
      armor: new fields.SchemaField({
        equipped: new fields.BooleanField({ initial: false }),
        name: new fields.StringField({ initial: "" }),
        dr: new fields.NumberField({ initial: 0 }),
        diceDr: new fields.NumberField({ initial: 0 }),
        bonus: new fields.StringField({ initial: "" }),
        skillAdjustment: new fields.SchemaField({
          value: new fields.NumberField({ initial: 0 }),
          reduction: new fields.NumberField({ initial: 0 }),
          total: new fields.NumberField({ initial: 0 }),
        }),
        penalties: new fields.SchemaField({
          defense: new fields.SchemaField({
            base: new fields.NumberField({ initial: 0 }),
            skill: new fields.NumberField({ initial: 0 }),
            total: new fields.NumberField({ initial: 0 }),
          }),
          fatigue: new fields.SchemaField({
            base: new fields.NumberField({ initial: 0 }),
            skill: new fields.NumberField({ initial: 0 }),
            total: new fields.NumberField({ initial: 0 }),
          }),
          recovery: new fields.SchemaField({
            base: new fields.NumberField({ initial: 0 }),
            skill: new fields.NumberField({ initial: 0 }),
            total: new fields.NumberField({ initial: 0 }),
          }),
          initiative: new fields.SchemaField({
            base: new fields.NumberField({ initial: 0 }),
            skill: new fields.NumberField({ initial: 0 }),
            total: new fields.NumberField({ initial: 0 }),
          }),
        }),
      }),
      shield: new fields.SchemaField({
        equipped: new fields.BooleanField({ initial: false }),
        name: new fields.StringField({ initial: "" }),
        dr: new fields.NumberField({ initial: 0 }),
        diceDr: new fields.NumberField({ initial: 0 }),
        defensePenalty: new fields.NumberField({ initial: 0 }),
        size: new fields.StringField({ initial: "" }),
        cover: new fields.NumberField({ initial: 0 }),
        fullCover: new fields.NumberField({ initial: 0 }),
        flanks: new fields.NumberField({ initial: 0 }),
        fatigue: new fields.SchemaField({
          base: new fields.NumberField({ initial: 0 }),
          skill: new fields.NumberField({ initial: 0 }),
          total: new fields.NumberField({ initial: 0 }),
        }),
        parry: new fields.SchemaField({
          base: new fields.NumberField({ initial: 0 }),
          skill: new fields.NumberField({ initial: 0 }),
          total: new fields.NumberField({ initial: 0 }),
        }),
        break: new fields.SchemaField({
          base: new fields.NumberField({ initial: 0 }),
          skill: new fields.NumberField({ initial: 0 }),
          total: new fields.NumberField({ initial: 0 }),
        }),
        bonus: new fields.StringField({ initial: "" }),
      }),
      money: new fields.SchemaField({
        copper: new fields.NumberField({ initial: 0 }),
        silver: new fields.NumberField({ initial: 0 }),
        gold: new fields.NumberField({ initial: 0 }),
        platinum: new fields.NumberField({ initial: 0 }),
      }),
      weightBonus: new fields.SchemaField({
        small: new fields.NumberField({ initial: 0 }),
        medium: new fields.NumberField({ initial: 0 }),
        large: new fields.NumberField({ initial: 0 }),
      }),
      settings: new fields.SchemaField({
        primary: new fields.StringField({ initial: "expert" }),
        secondary: new fields.StringField({ initial: "expert" }),
      }),
    }
  }
}

export class NpcData extends CommonActorData {
  static defineSchema() {
    const commonData = super.defineSchema();
    return {
      ...commonData,
      caution: new fields.SchemaField({
        value: new fields.NumberField({ initial: 0 }),
      }),
      combatNotes: new fields.StringField({ initial: "" }),
    }
  }
}