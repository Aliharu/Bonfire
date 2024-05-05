// new game.exaltedthird.applications.Importer().render(true);
export default class Importer extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "importer",
            title: "Importer",
            template: "systems/bonfire/templates/dialogues/importer.html",
        });
    }


    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        html.find(".import-button").on("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const form = html[0];
            if (!form.data.files.length) return ui.notifications.error("You did not upload a data file!");
            const text = await readTextFromFile(form.data.files[0]);

            var npcJson = JSON.parse((text));
            var itemData = [];

            const actorTemplate = {
                type: 'npc',
                system: {

                }
            };

            actorTemplate.name = npcJson.name;
            actorTemplate.system.vitality = {
                max: npcJson.combat.physical.fatigue,
            };
            if (!npcJson.combat.physical.notrauma) {
                actorTemplate.system.traumaThreshhold = {
                    value: npcJson.combat.physical.rollundertrauma,
                };
            }
            if (!npcJson.combat.physical.noknockback) {
                if (npcJson.combat.physical.knockback) {
                    actorTemplate.system.knockback = {
                        value: npcJson.combat.physical.knockback,
                    };
                }
                else {
                    var knockbackSizeMod = 0;
                    const knockbackSize = {
                        "Fine": -5,
                        "Diminutive": 0,
                        "Tiny": 5,
                        "Small": 10,
                        "Medium": 15,
                        "Large": 20,
                        "Huge": 25,
                        "Giant ": 30,
                        "Enormous": 35,
                        "Colossal": 40,
                    }
                    if (knockbackSize[npcJson.combat.physical.size]) {
                        knockbackSizeMod = knockbackSize[npcJson.combat.physical.size];
                    }
                    actorTemplate.system.knockback = {
                        value: knockbackSizeMod,
                    };
                }
            }

            if (Number.isInteger(npcJson.mental.stress)) {
                actorTemplate.system.stress = {
                    max: npcJson.mental.stress,
                };
            }
            if (Number.isInteger(npcJson.mental.caution)) {
                actorTemplate.system.caution = {
                    value: npcJson.mental.caution,
                };
            }
            actorTemplate.system.biography = npcJson.metanotes;
            actorTemplate.system.combatNotes = `<b><p>Attack Info</p></b>${npcJson.combat.attacknotes}<b><p>Defense Info</p></b>${npcJson.combat.defensenotes}<b><p>Tactics & Strategy</p></b>${npcJson.combat.tactics}`;
            actorTemplate.system.size = npcJson.combat.physical.size;

            for (const movement of npcJson.combat.physical.movement) {
                itemData.push(
                    {
                        type: "movement",
                        img: this.getImageUrl("movement"),
                        name: movement.type || 'Land',
                        system: {
                            "crawl": movement.movementSpeeds.strollspeed,
                            "walk": movement.movementSpeeds.walkspeed,
                            "jog": movement.movementSpeeds.jogspeed,
                            "run": movement.movementSpeeds.runspeed,
                            "sprint": movement.movementSpeeds.sprintspeed,
                        }
                    }
                );
            }

            for (const conviction of npcJson.confrontation.convictions) {
                itemData.push(
                    {
                        type: "characteristic",
                        img: this.getImageUrl("characteristic"),
                        name: conviction.characteristic,
                        system: {
                            type: "conviction",
                            value: conviction.rank,
                            formula: `1d20x+${conviction.rank}`
                        }
                    }
                );
            }

            for (const devotion of npcJson.confrontation.devotions) {
                itemData.push(
                    {
                        type: "characteristic",
                        img: this.getImageUrl("characteristic"),
                        name: devotion.characteristic,
                        system: {
                            type: "devotion",
                            value: devotion.rank,
                            formula: `1d20x+${devotion.rank}`
                        }
                    }
                );
            }

            for (const description of npcJson.confrontation.descriptions) {
                itemData.push(
                    {
                        type: "characteristic",
                        img: this.getImageUrl("characteristic"),
                        name: description.characteristic,
                        system: {
                            type: "description",
                            value: description.rank,
                            formula: `1d20x+${description.rank}`
                        }
                    }
                );
            }

            for (const flaw of npcJson.confrontation.flaws) {
                itemData.push(
                    {
                        type: "characteristic",
                        img: this.getImageUrl("characteristic"),
                        name: flaw,
                        system: {
                            type: "flaw",
                        }
                    }
                );
            }

            for (const burden of npcJson.confrontation.burdens) {
                itemData.push(
                    {
                        type: "burden",
                        img: this.getImageUrl("burden"),
                        name: burden.characteristic,
                        system: {
                            rank: burden.rank,
                            formula: `1d20x+${burden.rank}`
                        }
                    }
                );
            }

            for (const skill of npcJson.skills.skill) {
                itemData.push(
                    {
                        type: "skill",
                        img: this.getImageUrl("skill"),
                        name: skill.skill,
                        system: {
                            ranks: skill.rank,
                            formula: `1d20x+${skill.rank}`
                        }
                    }
                );
            }

            for (const attack of npcJson.combat.attacks) {
                var cover = 0;
                var fullCover = 0;
                var dr = 0;
                var diceDr = 0;
                var parryDiceDr = 0;
                var parryDr = 0;
                if (!Number.isInteger(attack.cover)) {
                    const coverArray = attack.cover.split('(');
                    cover = parseInt(coverArray[0].replace(/[^0-9]/g, ''));
                    if (coverArray.length > 1) {
                        fullCover = parseInt(coverArray[1].replace(/[^0-9]/g, ''));
                    }
                }
                else {
                    cover = attack.cover;
                }
                if (!Number.isInteger(attack.dr)) {
                    const drArray = attack.dr.split('/');
                    diceDr = parseInt(drArray[0].replace(/[^0-9]/g, ''));
                    if (drArray.length > 1) {
                        dr = parseInt(drArray[1].replace(/[^0-9]/g, ''));
                    }
                }
                else {
                    dr = attack.dr;
                }
                if (!Number.isInteger(attack.shieldDr)) {
                    const parryDrArray = attack.shieldDr.split('/');
                    parryDiceDr = parseInt(parryDrArray[0].replace(/[^0-9]/g, ''));
                    if (parryDrArray.length > 1) {
                        parryDr = parseInt(parryDrArray[1].replace(/[^0-9]/g, ''));
                    }
                }
                else {
                    parryDr = attack.shieldDr;
                }
                itemData.push(
                    {
                        type: "attack",
                        img: this.getImageUrl("attack"),
                        name: attack.weaponname || attack.defaultweaponname || 'Attack',
                        system: {
                            attack: attack.attack,
                            damageFormula: attack.damage?.replace("!", "x") || "",
                            attackType: attack.weaponType === 'r' ? 'ranged' : 'melee',
                            damageType: attack.damageType === 'S' ? 'slashing' : attack.damageType === 'P' ? 'piercing' : 'crushing',
                            recovery: attack.recovery,
                            initiative: attack.initiative,
                            defense: attack.defense,
                            cover: cover,
                            fullCover: fullCover,
                            rangeIncrement: attack.range,
                            parry: attack.parry,
                            flanks: attack.flanks,
                            dr: dr,
                            diceDr: diceDr,
                            parryDr: parryDr,
                            parryDiceDr: parryDiceDr,
                        }
                    }
                );
                actorTemplate.system.size
            }

            actorTemplate.items = itemData;
            await Actor.create(actorTemplate);

            this.close();
        });
    }

    getImageUrl(type) {
        if (type === 'skill') {
            return "icons/svg/upgrade.svg";
        }
        if (type === 'characteristic') {
            return "icons/svg/aura.svg";
        }
        if (type === 'contact') {
            return "icons/svg/cowled.svg";
        }
        if (type === 'wound') {
            return "icons/svg/blood.svg";
        }
        if (type === 'burden') {
            return "icons/svg/daze.svg";
        }
        if (type === 'expenditure') {
            return "systems/bonfire/assets/icons/gift-of-knowledge.svg";
        }
        if (type === 'rudiment') {
            return "systems/bonfire/assets/icons/magic-swirl.svg";
        }
        if (type === 'weapon' || type === 'attack') {
            return "icons/svg/sword.svg";
        }
        if (type === 'movement') {
            return "icons/svg/wing.svg"
        }
        return "icons/svg/item-bag.svg";
    }
}
