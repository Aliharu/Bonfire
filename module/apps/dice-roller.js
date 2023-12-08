export class RollForm extends FormApplication {
    constructor(actor, options, object, data) {
        super(object, options);
        this.actor = actor;
        this.object.rollType = data.dialogType;
        if (this.object.rollType === 'attack') {
            this.object.formula = this.actor.system.attacks[data.index].attack;
        }
        if (this.object.rollType === 'damage') {
            this.object.formula = this.actor.system.attacks[data.index].damage;
        }
        if (this.object.rollType === 'defense') {
            this.object.formula = this.actor.system.attacks[data.index].defenseFormula;
        }
        this.object.damageReduction = 0;
        this.object.diceDamageReduction = 0;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dialog"],
            popOut: true,
            template: "systems/bonfire/templates/dialogues/dialog-roll.html",
            id: "roll-form",
            title: `Roll`,
            width: 350,
            submitOnChange: true,
            closeOnSubmit: false
        });
    }

    getData() {
        return {
            actor: this.actor,
            data: this.object,
        };
    }

    async roll() {
        var _promiseResolve;
        this.promise = new Promise(function (promiseResolve) {
            _promiseResolve = promiseResolve
        });
        this.resolve = _promiseResolve;
        this.render(true);
        return this.promise;
    }

    async _updateObject(event, formData) {
        mergeObject(this, formData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('#roll-button').click((event) => {
            this._roll();
            this.close();
        });

        html.find('#cancel').click((event) => {
            this.close();
        });
    }

    async _roll() {
        let label = this.object.rollType.charAt(0).toUpperCase() + this.object.rollType.slice(1);
        let roll = new Roll(this.object.formula, this.actor.getRollData()).evaluate({ async: false });
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
            rollMode: game.settings.get('core', 'rollMode'),
        });
        if (this.object.rollType === 'damage' && (this.object.damageReduction || this.object.diceDamageReduction)) {
            var flatBonus = 0;
            var perDieDamageTotal = 0;
            for(const term of roll.terms) {
                if(term.constructor.name === 'NumericTerm') {
                    flatBonus += term.total;
                }
            }
            for (const dice of roll.dice) {
                for (var i = 0; i < dice.results.length; i++) {
                    var perDieTotal = 0;
                    while (dice.results[i] && dice.results[i].exploded) {
                        perDieTotal += dice.results[i].result;
                        dice.results.splice(i, 1);
                    }
                    if (dice.results[i]) {
                        perDieTotal += dice.results[i].result;
                    }
                    if (this.object.diceDamageReduction) {
                        perDieTotal -= this.object.diceDamageReduction;
                    }
                    dice.results[i].result = perDieTotal;
                    if(perDieTotal < 0) {
                        flatBonus = Math.max(0, flatBonus + perDieTotal);
                    }
                    else {
                        perDieDamageTotal += perDieTotal;
                    }
                }
            }
            roll._total = Math.max(0, perDieDamageTotal + flatBonus - this.object.damageReduction);
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: 'Post DR Damage',
                rollMode: game.settings.get('core', 'rollMode'),
            });
        }
        return roll;
    }
}