export class RollForm extends FormApplication {
    constructor(actor, options, object, data) {
        super(object, options);
        this.actor = actor;
        this.object.rollType = data.dialogType;
        if (this.object.rollType === 'attack') {
            this.object.formula = this.actor.system.attacks[data.index].attack;
        }
        if(this.object.rollType === 'damage') {
            this.object.formula = this.actor.system.attacks[data.index].damage;
        }
        if(this.object.rollType === 'defense') {
            this.object.formula = this.actor.system.attacks[data.index].defenseFormula;
        }
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
        let roll = new Roll(this.object.formula, this.actor.getRollData());
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
            rollMode: game.settings.get('core', 'rollMode'),
        });
        return roll;
    }
}