/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class BonfireItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    if (!data.img || data.img === "icons/svg/item-bag.svg") {
      this.updateSource({ img: this.getImageUrl(data.type) });
    }
  }

  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;

    if(itemData.type === 'item') {
      systemData.fullCost = {
        source: systemData.cost.source,
        local: systemData.cost.local,
        nearby: systemData.cost.nearby,
        distant: systemData.cost.distant,
      }
      for(var i = 0; i < systemData.quality; i++) {
        systemData.fullCost.source = systemData.fullCost.source + (50 + (i * 10));
        systemData.fullCost.local = systemData.fullCost.local + (50 + (i * 10));
        systemData.fullCost.nearby = systemData.fullCost.nearby + (50 + (i * 10));
        systemData.fullCost.distant = systemData.fullCost.distant + (50 + (i * 10));
      }
      systemData.fullCost.source = systemData.fullCost.source.toFixed(2);
      systemData.fullCost.local = systemData.fullCost.local.toFixed(2);
      systemData.fullCost.nearby = systemData.fullCost.nearby.toFixed(2);
      systemData.fullCost.distant = systemData.fullCost.distant.toFixed(2);
    }
    if(itemData.type === 'skill') {
      systemData.cost = (systemData.ranks * 3) + systemData.baseCost;
      if(this.actor) {
        systemData.cost -= this.actor.system.skillAdepts;
      }
    }
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
  getRollData() {
    // If present, return the actor's roll data.
    if (!this.actor) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
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
    if (type === 'weapon') {
      return "icons/svg/sword.svg";
    }
    return "icons/svg/item-bag.svg";
  }

  async attack() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    const rollData = this.getRollData();
    const roll = new Roll(rollData.item.damageFormula, rollData);
    roll.toMessage({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
    });
    return roll;
  }
}
