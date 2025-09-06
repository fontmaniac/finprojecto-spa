/* FM: Data Model holding "terms" for a financial loan (calculator) */

import { PeriodUnit, normaliseTermLength, deNormaliseTermLength } from './Definitions.js'

/**
 * @typedef {Object} LoanTerms
 * @property {number} principalAmount
 * @property {number} paymentAmount
 * @property {PeriodUnit} paymentFreqUnit
 * @property {number} annualInterestRate
 * @property {number} termLength
 * @property {PeriodUnit} termLengthUnit
 * @property {number} termLengthNorm
 * @property {string} fieldToCalculate
 * @property {number} initialOffsetAmount
 * @property {number} extraRepaymentAmount
 * @property {number} offsetTopUpAmount
 *
 */

export function makeDefaultLoanTerms() {
    return { 
        principalAmount: 300000,
        paymentAmount: undefined, 
        paymentFreqUnit: 'month', 
        annualInterestRate: 0.07, 
        termLength: 30,
        termLengthUnit: 'year',
        termLengthNorm: undefined,
        fieldToCalculate: 'paymentAmount',
        initialOffsetAmount: 150000,
        extraRepaymentAmount: 0,
        offsetTopUpAmount: 0
    };
}

/**
 * Returns number of periods per year for a given frequency key
 * @param {string} freqKey - e.g. 'month', 'week'
 * @returns {number}
 */
export function frequencyPerYear(freqKey) {
    return PeriodUnit[freqKey]?.perYear ?? 12; // default to monthly if unknown
}

/**
 * Converts annual interest rate to per-period rate
 * @param {number} annualRate
 * @param {string} freqKey
 * @returns {number}
 */
export function annualToTermRate(annualRate, freqKey) {
    return annualRate / frequencyPerYear(freqKey);
}

/**
 * Calculates periodic payment amount
 * @param {number} principal
 * @param {string} freqKey
 * @param {number} annualRate
 * @param {number} termLength
 * @returns {number}
 */
export function calculateTermPayment(principal, freqKey, annualRate, termLength) {
    const r = annualToTermRate(annualRate, freqKey);
    const n = termLength;
    return r * principal / (1 - Math.pow(1 + r, -n));
}

/**
 * Calculates principal amount from payment
 * @param {string} freqKey
 * @param {number} annualRate
 * @param {number} termLength
 * @param {number} payment
 * @returns {number}
 */
export function calculatePrincipal(freqKey, annualRate, termLength, payment) {
    const r = annualToTermRate(annualRate, freqKey);
    const n = termLength;
    return payment * (1 - Math.pow(1 + r, -n)) / r;
}

/**
 * Calculates term length from principal and payment
 * @param {number} principal
 * @param {string} freqKey
 * @param {number} annualRate
 * @param {number} payment
 * @returns {number}
 */
export function calculateTerm(principal, freqKey, annualRate, payment) {
    const r = annualToTermRate(annualRate, freqKey);
    return Math.log(1 / (1 - r * principal / payment)) / Math.log(1 + r);
}

export function computeLoanTerms(inputTerms) {
    console.log('computeLoanTerms called ', inputTerms);

    const t = inputTerms;
    if (t.fieldToCalculate === undefined || t.fieldToCalculate == null) {
        return inputTerms;
    }

    let normalisedTermLength = t.termLength;

    let resultValue = 0.0;
    if (t.fieldToCalculate === 'termLength') {
        normalisedTermLength = calculateTerm(t.principalAmount, t.paymentFreqUnit, t.annualInterestRate, t.paymentAmount);
        resultValue = deNormaliseTermLength(normalisedTermLength, t.termLengthUnit, t.paymentFreqUnit);
    }
    else {
        normalisedTermLength = normaliseTermLength(t.termLength, t.termLengthUnit, t.paymentFreqUnit);
    }
    
    if (t.fieldToCalculate === 'paymentAmount') {
        resultValue = calculateTermPayment(t.principalAmount, t.paymentFreqUnit, t.annualInterestRate, normalisedTermLength);
    }
    else if (t.fieldToCalculate === 'principalAmount') {
        resultValue = calculatePrincipal(t.paymentFreqUnit, t.annualInterestRate, normalisedTermLength, t.paymentAmount);
    }

    const round = (value) => Math.round(value * 100) / 100;

    const result = { 
        ...inputTerms, 
        ['termLengthNorm']: round(normalisedTermLength), 
        [inputTerms.fieldToCalculate]: round(resultValue)
    }

    console.log('computeLoanTerms returning ', result);

    return result;
}