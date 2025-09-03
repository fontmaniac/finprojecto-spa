/* FM: Structures for simulating and representing the whole lifetime of the loan. */

import { PeriodUnit, normaliseTermLength } from './Definitions.js';

// Loan Slice "class"
function createLoanSlice(index, values = {}) {
    return {
        sliceIndex: index,

        // Mutable fields
        startLoanBalance:   values.startLoanBalance || 0,
        startOffsetBalance: values.startOffsetBalance || 0,
        repayment:          values.repayment || 0,
        extraRepayment:     values.extraRepayment || 0,
        offsetTopUp:        values.offsetTopUp || 0,
        periodInterestRate: values.periodInterestRate || 0,

        // Derived fields (computed later)
        interestCharged: null,
        endLoanBalance: null,
        endOffsetBalance: null,

        // Optional metadata
        isModified: false
    };
}

// // Slice Mutation "class"
// function createSliceMutation(sliceIndex, fieldName, value) {
//     return {
//         sliceIndex,
//         fieldName,
//         value
//     };
// }

// // Loan Simulation "class" declaration.
// function createLoanSimulation(slices = []) {
//     return {
//         slices,

//         // mutation: SliceMutation
//         modify: function (mutation) {
//             const updatedSlices = this.slices.map((slice, index) => {
//                 const applicable = mutation.sliceIndex <= index;
//                 if (!applicable) return slice;

//                 const newSlice = { ...slice };
//                 if (mutation.fieldName in newSlice) {
//                     newSlice[mutation.fieldName] = mutation.value;
//                     newSlice.isModified = true;
//                 };

//                 return newSlice;
//             });

//             // Optionally recompute derived fields here
//             return createLoanSimulation(updatedSlices);
//         }
//     };
// }

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

    const frequencyPerYear = PeriodUnit[paymentFreqUnit].perYear;
    const periodInterestRate = annualInterestRate / frequencyPerYear;

    return createLoanSlice(0, {
        startLoanBalance: principalAmount,
        startOffsetBalance: initialOffsetAmount,
        repayment: paymentAmount,
        extraRepayment: extraRepaymentAmount,
        offsetTopUp: offsetTopUpAmount,
        periodInterestRate: periodInterestRate
    });
}

function generateNextSlice(last) {
    return createLoanSlice(last.sliceIndex + 1, {
        startLoanBalance: last.endLoanBalance,
        startOffsetBalance: last.endOffsetBalance,
        repayment: last.repayment,
        extraRepayment: last.extraRepayment,
        offsetTopUp: last.offsetTopUp,
        periodInterestRate: last.periodInterestRate
    });
} 

function completeSlice(slice) {
    const interestCharged = Math.max(slice.startLoanBalance - Math.max(slice.startOffsetBalance, 0), 0) * slice.periodInterestRate;
    const endLoanBalance = slice.startLoanBalance + interestCharged - slice.repayment - slice.extraRepayment;
    const endOffsetBalance = slice.startOffsetBalance + slice.offsetTopUp;
    return {
        ...slice, 
        interestCharged: interestCharged,
        endLoanBalance: endLoanBalance,
        endOffsetBalance: endOffsetBalance
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
        slices[0] = completeSlice(slices[0]);
        slices.unshift(generateNextSlice(slices[0]));
    } while (slices[0].startLoanBalance > 0 && !shouldTerminateSimulation(slices))

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
