/* FM: Common definitions */

export const PeriodUnit = Object.freeze({
    year:      { freqLabel: 'Yearly',      plural: 'Years',      perYear: 1,   daysPerUnit: 365 },
    quarter:   { freqLabel: 'Quarterly',   plural: 'Quarters',   perYear: 4,   daysPerUnit: 365 / 4 },
    month:     { freqLabel: 'Monthly',     plural: 'Months',     perYear: 12,  daysPerUnit: 365 / 12 },
    fortnight: { freqLabel: 'Fortnightly', plural: 'Fortnights', perYear: 26,  daysPerUnit: 14 },
    week:      { freqLabel: 'Weekly',      plural: 'Weeks',      perYear: 52,  daysPerUnit: 7 },
    day:       { freqLabel: 'Daily',       plural: 'Days',       perYear: 365, daysPerUnit: 1 }
});


/**
 * Converts a raw term length (e.g. 24 months) into normalized number of payment periods
 * @param {number} termLength - raw input (e.g. 24)
 * @param {string} termLengthUnit - e.g. 'month', 'year'
 * @param {string} paymentFreqUnit - e.g. 'month', 'week'
 * @returns {number} normalized term length in payment periods
 */
export function normaliseTermLength(termLength, termLengthUnit, paymentFreqUnit) {
    const termUnit = PeriodUnit[termLengthUnit];
    const freqUnit = PeriodUnit[paymentFreqUnit];

    if (!termUnit || !freqUnit) {
        throw new Error(`Unrecognized units: ${termLengthUnit}, ${paymentFreqUnit}`);
    }

    const termLengthInYears = (termUnit.daysPerUnit * termLength) / 365;
    const normalised = Math.round(termLengthInYears * freqUnit.perYear);

    return normalised;
}

/**
 * Converts a normalized term length (in payment periods) back into raw term length
 * expressed in desired units (e.g. months, years)
 * @param {number} termLengthNorm - normalized input (e.g. 24 payment periods)
 * @param {string} termLengthUnit - desired output unit (e.g. 'month', 'year')
 * @param {string} paymentFreqUnit - frequency unit used for normalization (e.g. 'week', 'month')
 * @returns {number} de-normalized term length in desired units
 */
export function deNormaliseTermLength(termLengthNorm, termLengthUnit, paymentFreqUnit) {
    const targetUnit = PeriodUnit[termLengthUnit];
    const freqUnit = PeriodUnit[paymentFreqUnit];

    if (!targetUnit || !freqUnit) {
        throw new Error(`Unrecognized units: ${termLengthUnit}, ${paymentFreqUnit}`);
    }

    const totalDays = termLengthNorm * freqUnit.daysPerUnit;
    const termLength = totalDays / targetUnit.daysPerUnit;

    return termLength;
}

