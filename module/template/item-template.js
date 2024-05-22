import { activatableData, traitField } from "./common-template.js";

const fields = foundry.data.fields;

class CommonItemData extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        // Note that the return is just a simple object
        return {
            description: new fields.HTMLField({ initial: "" }),
            pagenum: new fields.StringField({ initial: "" }),
        }
    }
    toPlainObject() {
        return { ...this };
    }
}

export class ItemData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            quantity: new fields.NumberField({ initial: 1 }),
            quality: new fields.NumberField({ initial: 0 }),
            weight: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0 }),
                type: new fields.StringField({ initial: "" }),
            }),
            cost: new fields.SchemaField({
                source: new fields.NumberField({ initial: 0 }),
                local: new fields.NumberField({ initial: 0 }),
                nearby: new fields.NumberField({ initial: 0 }),
                distant: new fields.NumberField({ initial: 0 }),
            }),
            formula: new fields.StringField({ initial: "d20x" }),
        }
    }
}

export class ItemSkillData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            formula: new fields.StringField({ initial: "d20x" }),
            ranks: new fields.NumberField({ initial: 0 }),
            mod: new fields.NumberField({ initial: 0 }),
            baseCost: new fields.NumberField({ initial: 0 }),
        }
    }
}

export class ItemCharacteristicData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            formula: new fields.StringField({ initial: "d20x" }),
            value: new fields.NumberField({ initial: 0 }),
            type: new fields.StringField({ initial: "description" }),
        }
    }
}

export class ItemContactData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            knowledge: new fields.NumberField({ initial: 1 }),
            organization: new fields.NumberField({ initial: 1 }),
        }
    }
}

export class ItemWoundData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            amount: new fields.NumberField({ initial: 1 }),
            toHeal: new fields.NumberField({ initial: 0 }),
        }
    }
}

export class ItemBurdenData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            crp: new fields.NumberField({ initial: 0 }),
            rank: new fields.NumberField({ initial: 0 }),
        }
    }
}

export class ItemMovementData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            crawl: new fields.NumberField({ initial: 2.5 }),
            walk: new fields.NumberField({ initial: 5 }),
            jog: new fields.NumberField({ initial: 10 }),
            run: new fields.NumberField({ initial: 15 }),
            sprint: new fields.NumberField({ initial: 20 }),
        }
    }
}

export class ItemExpenditureData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            amount: new fields.NumberField({ initial: 0 }),
        }
    }
}

export class ItemRudimentData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            drain: new fields.NumberField({ initial: 0 }),
            type: new fields.StringField({ initial: "" }),
        }
    }
}

export class ItemWeaponData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            quantity: new fields.NumberField({ initial: 1 }),
            quality: new fields.NumberField({ initial: 0 }),
            weight: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0 }),
                type: new fields.StringField({ initial: "" }),
            }),
            cost: new fields.SchemaField({
                source: new fields.NumberField({ initial: 0 }),
                local: new fields.NumberField({ initial: 0 }),
                nearby: new fields.NumberField({ initial: 0 }),
                distant: new fields.NumberField({ initial: 0 }),
            }),
            formula: new fields.StringField({ initial: "d20x" }),
            equipped: new fields.BooleanField({ initial: true }),
            damageFormula: new fields.StringField({ initial: "1d12x" }),
            damageType: new fields.StringField({ initial: "piercing" }),
            attackType: new fields.StringField({ initial: "melee" }),
            size: new fields.StringField({ initial: "small" }),
            maxRange: new fields.NumberField({ initial: 0 }),
            minRecovery: new fields.NumberField({ initial: 0 }),
            attack: new fields.NumberField({ initial: 0 }),
            damage: new fields.NumberField({ initial: 0 }),
            recovery: new fields.NumberField({ initial: 0 }),
            defense: new fields.NumberField({ initial: 0 }),
            rangeIncrement: new fields.NumberField({ initial: 0 }),
            parry: new fields.NumberField({ initial: 0 }),
            measure: new fields.NumberField({ initial: 0 }),
            baseParry: new fields.NumberField({ initial: 0 }),
            bonus: new fields.StringField({ initial: "" }),
            traits: new fields.StringField({ initial: "" }),
            characterBonuses: new fields.SchemaField({
                attack: new fields.NumberField({ initial: 0 }),
                recovery: new fields.NumberField({ initial: 0 }),
                parry: new fields.NumberField({ initial: 0 }),
                damage: new fields.NumberField({ initial: 0 }),
            }),
        }
    }
}

export class ItemAttackData extends CommonItemData {
    static defineSchema() {
        const commonData = super.defineSchema();

        return {
            ...commonData,
            quantity: new fields.NumberField({ initial: 1 }),
            quality: new fields.NumberField({ initial: 0 }),
            weight: new fields.SchemaField({
                value: new fields.NumberField({ initial: 0 }),
                type: new fields.StringField({ initial: "" }),
            }),
            cost: new fields.SchemaField({
                source: new fields.NumberField({ initial: 0 }),
                local: new fields.NumberField({ initial: 0 }),
                nearby: new fields.NumberField({ initial: 0 }),
                distant: new fields.NumberField({ initial: 0 }),
            }),
            equipped: new fields.BooleanField({ initial: false }),
            formula: new fields.StringField({ initial: "d20x" }),
            damageFormula: new fields.StringField({ initial: "1d12x" }),
            damageType: new fields.StringField({ initial: "piercing" }),
            attackType: new fields.StringField({ initial: "melee" }),
            size: new fields.StringField({ initial: "small" }),
            attack: new fields.NumberField({ initial: 0 }),
            recovery: new fields.NumberField({ initial: 0 }),
            defense: new fields.NumberField({ initial: 0 }),
            rangeIncrement: new fields.NumberField({ initial: 0 }),
            parry: new fields.NumberField({ initial: 0 }),
            measure: new fields.NumberField({ initial: 0 }),
            baseParry: new fields.NumberField({ initial: 0 }),
            cover: new fields.NumberField({ initial: 0 }),
            fullCover: new fields.StringField({ initial: "0" }),
            dr: new fields.NumberField({ initial: 0 }),
            diceDr: new fields.NumberField({ initial: 0 }),
            parryDr: new fields.NumberField({ initial: 0 }),
            parryDiceDr: new fields.NumberField({ initial: 0 }),
            bonus: new fields.StringField({ initial: "" }),
            traits: new fields.StringField({ initial: "" }),
        }
    }
}