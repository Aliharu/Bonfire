export class BonfireDie extends Die {
    static MODIFIERS = { ...this.MODIFIERS, bx: 'bonfireExplode' };

    get total() {
        const rv = super.total;
        if (!rv) return rv;
        return this.results.reduce((t, r) => t + (r.bias ?? 0), rv);
    }

    roll({ minimize = false, maximize = false, faces = false } = {}) {
        const roll = super.roll({ minimize, maximize });
        this.results[this.results.length - 1] = roll;

        if (faces) {
            roll.faces = faces;
            roll.result = Math.ceil(CONFIG.Dice.randomUniform() * faces);
        }

        return roll;
    }

    bonfireExplode(modifier, { recursive = true } = {}) {
        const rgx = /bx([0-9]+)?([<>=]+)?([0-9]+)?/i;
        const match = modifier.match(rgx);
        if (!match) return false;
        let [max, comparison, target] = match.slice(1);

        // If no comparison or target are provided, treat the max as the target value
        if (max && !(target || comparison)) {
            target = max;
            max = null;
        }

        // Determine target values
        target = Number.isNumeric(target) ? parseInt(target, 10) : this.faces;
        comparison = comparison || '=';
        if (target === 1) max = 0;


        // Dice decay
        let pFaces = false;
        if (this.faces === 100) { pFaces = 20; } else
            if (this.faces === 20) { pFaces = 6; }

        // Recursively explode until there are no remaining results to explode
        let checked = 0;
        const initial = this.results.length;

        while (checked < this.results.length) {
            const r = this.results[checked];
            checked++;
            if (!r.active) continue;


            // Determine whether to explode the result and roll again!
            if (r.faces) target = r.faces;

            if (DiceTerm.compareResult(r.result, comparison, target)) {
                r.exploded = true;
                this.roll({ faces: pFaces });
            }

            // Limit recursion
            if (!recursive && (checked === initial)) break;
            if (checked > 1000) throw new Error('Maximum recursion depth for exploding dice roll exceeded');
        }
    }

    getResultLabel(result) {
        return String(result.result + (result?.bias || 0));
    }

    getResultCSS(result) {
        const rv = super.getResultCSS(result);
        rv[1] = `d${result.faces ?? this.faces}`;
        rv[5] = result.exploded ? 'exploded' : rv[5];
        rv[8] = result.result === (result.faces ?? this.faces) ? 'max' : null;
        return rv;
    }
}
