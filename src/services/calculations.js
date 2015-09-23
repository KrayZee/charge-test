import CalculatorFormData from '../entities/calculatorFormData';
import CountryPrices from '../entities/countryPrices';
import VehicleType from '../entities/vehicleType';
import RechargingAbility from '../entities/rechargingAbility';
import PurchaseOptions from '../entities/purchaseOptions';
import Truck from '../entities/truck';

/**
 * @param {Truck} truck
 * @returns {number}
 */
function getChargeTruckCost(truck) {
    return truck.cost;
}

/**
 * @param {Truck} truck
 * @returns {number}
 */
function getChargePOL(truck) {
    return truck.pol;
}

/**
 * @param {number} cost
 * @param {number} upfrontPayment
 * @param {number} term
 * @param {number} interestRate
 * @returns {number}
 */
function getLeasingYearPayment(cost, upfrontPayment, term, interestRate) {
    // calculate leasing year payment as annuity payment
    // https://en.wikipedia.org/wiki/Annuity
    if (interestRate === 0) {
        return cost * (1 - upfrontPayment) / term;
    }

    let k = Math.sqrt(1 + interestRate);
    let kn = Math.pow(k, term);
    return cost * (1 - upfrontPayment) * kn * (k - 1) / (kn - 1);
}

export default {
    /**
     * @param {CalculatorFormData} formData
     * @param {Truck} truck
     * @returns {number[]}
     */
    calculateChargeAnnualCosts: function (formData, truck) {
        var truckCost = truck.cost;
        var polCost = truck.pol;
        var costs = new Array(formData.term + 1);

        costs.fill(polCost);

        if (formData.purchaseOption == PurchaseOptions.ONE_TIME_PAYMENT) {
            costs[0] = costs[0] + truckCost;
        } else {
            let paidAmount = truckCost * formData.upfrontPayment;
            let yearLeasingPayment = getLeasingYearPayment(truckCost, formData.upfrontPayment, formData.term, formData.interestRate);

            costs[0] = costs[0] + paidAmount;

            for (let i = 0; i < formData.term; i++) {
                costs[i + 1] = costs[i + 1] + yearLeasingPayment;
            }
        }

        return costs;
    },

    /**
     * @param {CalculatorFormData} formData
     * @returns {number[]}
     */
    calculateAnalogueAnnualCosts: function (formData) {
        var truckCost = 6000;
        var polCost = truckCost * 2;
        var costs = new Array(formData.term + 1);

        costs.fill(polCost);
        costs[0] = costs[0] + truckCost;
        return costs;
    },

    /**
     * @param {number[]} analogueAnnualCost
     * @param {number[]} chargeAnnualCost
     * @returns {number[]}
     */
    calculateSavings: function (analogueAnnualCost, chargeAnnualCost) {
        let savings = [];

        analogueAnnualCost.forEach((amount, index) => {
            savings[index] = analogueAnnualCost[index] - chargeAnnualCost[index];

            if (index === 0) return;
            savings[index] = savings[index - 1] + savings[index];
        });

        // push last item as an item with total saving amount
        savings.push(savings[savings.length - 1]);

        return savings;
    },

    /**
     * @param {number[]} chargeAnnualCosts
     * @param {number[]} analogueAnnualCosts
     * @returns {number}
     */
    calculatePaybackPeriod: function (chargeAnnualCosts, analogueAnnualCosts) {
        return (chargeAnnualCosts[0] - analogueAnnualCosts[0]) / (analogueAnnualCosts[1] - chargeAnnualCosts[1]);
    }
}