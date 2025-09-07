/* FM: Structures for simulating and representing the whole lifetime of the loan. */

import { PeriodUnit, normaliseTermLength } from './Definitions.js';
import { calculateTermPayment } from './LoanTermsModel.js';

// Loan Slice "class"
function createLoanSlice(index, values = {}) {
    return {
        sliceIndex: index,

        // Immutable fields
        startLoanBalance:       values.startLoanBalance || 0,
        startOffsetBalance:     values.startOffsetBalance || 0,
        paymentFreqUnit:        values.paymentFreqUnit || 'month',
        totalRepaymentsAtStart: values.totalRepaymentsAtStart || 0,
        totalInterestAtStart:   values.totalInterestAtStart || 0,

        // Mutable fields
        extraRepayment:         values.extraRepayment || 0,
        offsetTopUp:            values.offsetTopUp || 0,
        annualInterestRate:     values.annualInterestRate || 0,



        // Derived fields (computed later)
        repayment:              values.repayment || 0,
        periodInterestRate: null,
        interestCharged: null,
        endLoanBalance: null,
        endOffsetBalance: null,
        totalRepaymentsAtEnd: null,
        totalInterestAtEnd: null,

        // Optional metadata
        isModified: false
    };
}

function generateZeroSlice(terms) {
    const {
        principalAmount,
        paymentAmount,
        paymentFreqUnit,
        annualInterestRate,
        initialOffsetAmount,
        extraRepaymentAmount,
        offsetTopUpAmount
    } = terms;

    return createLoanSlice(0, {
        startLoanBalance: principalAmount,
        startOffsetBalance: initialOffsetAmount,
        repayment: paymentAmount,
        extraRepayment: extraRepaymentAmount,
        offsetTopUp: offsetTopUpAmount,
        annualInterestRate: annualInterestRate,
        paymentFreqUnit: paymentFreqUnit
    });
}

function generateNextSlice(last) {
    return createLoanSlice(last.sliceIndex + 1, {
        startLoanBalance: last.endLoanBalance,
        startOffsetBalance: last.endOffsetBalance,
        repayment: last.repayment,
        extraRepayment: last.extraRepayment,
        offsetTopUp: last.offsetTopUp,
        annualInterestRate: last.annualInterestRate,
        paymentFreqUnit: last.paymentFreqUnit,
        totalRepaymentsAtStart: last.totalRepaymentsAtEnd,
        totalInterestAtStart: last.totalInterestAtEnd
    });
} 

export function completeSlice(slice, terms) {
    const frequencyPerYear = PeriodUnit[slice.paymentFreqUnit].perYear;
    const periodInterestRate = slice.annualInterestRate / frequencyPerYear;

    const repayment = calculateTermPayment(
        terms.principalAmount,
        terms.paymentFreqUnit,
        slice.annualInterestRate,
        terms.termLengthNorm);

    const fullRepayment = (repayment + slice.extraRepayment);
    const interestCharged = Math.max(slice.startLoanBalance - Math.max(slice.startOffsetBalance, 0), 0) * periodInterestRate;
    const endLoanBalance = slice.startLoanBalance + interestCharged - fullRepayment;
    const endOffsetBalance = slice.startOffsetBalance + slice.offsetTopUp;

    const totalRepaymentsAtEnd = slice.totalRepaymentsAtStart + fullRepayment;
    const totalInterestAtEnd = slice.totalInterestAtStart + interestCharged;

    return {
        ...slice, 
        repayment: repayment,
        periodInterestRate: periodInterestRate,
        interestCharged: interestCharged,
        endLoanBalance: endLoanBalance,
        endOffsetBalance: endOffsetBalance,
        totalRepaymentsAtEnd: totalRepaymentsAtEnd,
        totalInterestAtEnd: totalInterestAtEnd
    }
}

function shouldTerminateSimulation(slices) {
    const lastSlice = slices[0];
    return lastSlice?.sliceIndex >= 10000;
}

export function generateLoanSimulation(terms) {
    const zeroSlice = generateZeroSlice(terms);
    const slices = [zeroSlice];
    
    do {
        slices[0] = completeSlice(slices[0], terms);
        slices.unshift(generateNextSlice(slices[0]));
    } while (slices[0].startLoanBalance > 0 && !shouldTerminateSimulation(slices))

    slices.shift()
    return slices.reverse();
}

export function updateLoanSimulation(terms, oldSlices, updatedSlice) {
    console.log('updateLoanSimulation, terms', terms, 'updatedSlice', updatedSlice);
    const slices = [];
    let sliceIdx = 0;
    do {
        if (sliceIdx < updatedSlice.sliceIndex) {
            // Old slices already computed and completed
            slices.unshift(oldSlices[sliceIdx]);
        } else if (sliceIdx == updatedSlice.sliceIndex) {
            // Updated slice is not yet completed, but will be on next iteration
            slices.unshift({...updatedSlice, isModified: true});
        } else {
            // We are past the updated slice index. Compute as for original generation.
            slices[0] = completeSlice(slices[0], terms);
            slices.unshift(generateNextSlice(slices[0]));
        }
        sliceIdx++;
    } while (slices[0].startLoanBalance > 0 && !shouldTerminateSimulation(slices))

    slices.shift()
    return slices.reverse();
}


export function extractLoanSimulationOutcome(slices, paymentFreqUnit) {
    let totalRepayments = 0;
    let totalRepaymentAmount = 0;
    let totalInterestCharged = 0;
    let offsetMatchPoint = undefined;
    let totalBalanceAtCompletion = 0;

    for (let i = 0; i < slices.length; ++i) {
        const slice = slices[i];
        totalBalanceAtCompletion = slice.startOffsetBalance - slice.startLoanBalance;
        if (slice.endLoanBalance === null) break;
        
        totalRepayments += 1;
        totalRepaymentAmount += slice.repayment + slice.extraRepayment;
        totalInterestCharged += slice.interestCharged

        if (offsetMatchPoint === undefined && slice.endOffsetBalance > 0 && slice.endLoanBalance <= slice.endOffsetBalance) {
            offsetMatchPoint = slice.sliceIndex;
        }
    }

    return {
        totalRepayments: totalRepayments,
        totalRepaymentAmount: totalRepaymentAmount,
        totalInterestCharged: totalInterestCharged,
        offsetMatchPoint: offsetMatchPoint,
        totalBalanceAtCompletion: totalBalanceAtCompletion,
        paymentFreqUnit: paymentFreqUnit
    };
}

export const Columns = [
    { key: 'sliceIndex', name: 'Slice Index' },
    { key: 'startLoanBalance', name: 'Start Loan Balance' },
    { key: 'startOffsetBalance', name: 'Start Offset Balance' },
    { key: 'totalRepaymentsAtStart', name: 'Total Repayment (before)' },
    { key: 'totalInterestAtStart', name: 'Total Interest (before)' },
    { key: 'repayment', name: 'Repayment' },
    { key: 'extraRepayment', name: 'Extra Repayment' },
    { key: 'offsetTopUp', name: 'Offset Top-Up' },
    { key: 'annualInterestRate', name: 'Annual Interest Rate' },
    { key: 'periodInterestRate', name: 'Period Interest Rate' },
    { key: 'interestCharged', name: 'Interest Charged' },
    { key: 'endLoanBalance', name: 'End Loan Balance' },
    { key: 'endOffsetBalance', name: 'End Offset Balance' },
    { key: 'totalRepaymentsAtEnd', name: 'Total Repayment (after)' },
    { key: 'totalInterestAtEnd', name: 'Total Interest (after)' },
];

export function toCsv(slices) {

    const header = Columns.map(col => col.name).join(',');

    const formatter = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        useGrouping: false
    });

    const format = (val) => {
        if (val === null || val === undefined) return '';
        if (typeof val === 'number') return formatter.format(val);
        return String(val);
    };

    const rows = slices.map(slice =>
        Columns.map(col => format(slice[col.key])).join(',')
    );

    return [header, ...rows].join('\n');
}
