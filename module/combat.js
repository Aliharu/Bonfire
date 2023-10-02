export class BonfireCombat extends Combat {
  async rollInitiative(ids, {formula=null, updateTurn=true, messageOptions={}}={}) {
    const { round } = this;
    let initFormula = formula;
    if (!initFormula) {
      const initDie = await Dialog.wait({
        title: `Roll Initiative`,
        content: await renderTemplate("systems/bonfire/templates/dialogues/roll-dice.html"),
        buttons: {
          getdie: {
            label: 'Roll',
            callback: () => ({ die: document.getElementById('rollFormula').value }),
          },
          start: {
            label: 'Immediate',
            callback: () => ({ die: false }),
          },
        },
      });
      if (initDie?.die) {
        initFormula = `{${initDie.die}, 1}kh + ${round}`;
      } else {
        initFormula = `${Math.max(round, 1)}`;
        messageOptions.sound = null; // eslint-disable-line
      }
    }

    const rollData = { formula: initFormula, updateTurn, messageOptions };
    return super.rollInitiative(ids, rollData);
  }
}