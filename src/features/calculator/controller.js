import _ from 'lodash';

import Country from '../../entities/country';
import CalculatorFormData from '../../entities/calculatorFormData';
import VehicleType from '../../entities/vehicleType';
import RechargingAbility from '../../entities/rechargingAbility';
import PurchaseOptions from '../../entities/purchaseOptions';

var CURRENT_YEAR = new Date().getFullYear();

/**
 * @param {CalculatorFormData} formData
 * @returns {number}
 */
function getChargeTruckCost(formData) {
    return 100000;
}

/**
 * @param {CalculatorFormData} formData
 * @returns {number}
 */
function getChargePOL(formData) {
    return getChargeTruckCost(formData) * 0.05;
}

function getLeasingYearPayment(truckCost, upfrontPayment, term, interestRate) {
    // calculate leasing year payment as annuity payment
    // https://en.wikipedia.org/wiki/Annuity

    let k = Math.sqrt(1 + interestRate);
    let kn = Math.pow(k, term);
    return truckCost * (1 - upfrontPayment) * kn * (k - 1) / (kn - 1);
}

/**
 * @param {CalculatorFormData} formData
 * @returns {double[]}
 */
function getChargeAnnualCosts(formData) {
    if (formData.term === undefined) return [];
    if (formData.purchaseOption === undefined) return [];
    if (formData.upfrontPayment === undefined) return [];

    var truckCost = getChargeTruckCost(formData);
    var polCost = getChargePOL(formData);
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
}

export default class CalculatorController {
    constructor($scope) {
        this.countries = [
            new Country('United Kingdom', 'uk')
        ];

        this.chargeTruck = {
            name: 'Charge 6t 32 kWh'
        };

        this.analogueTruck = {
            name: 'Isuzu NPR 6t'
        };

        this.formData = new CalculatorFormData();
        this.formData.vehicleType = 1;
        this.formData.truckWeight = 5.5;
        this.formData.country = this.countries[0];
        this.formData.dieselPrice = 1.1;
        this.formData.electricityPrice = 10.5;
        this.formData.oneTimeSubsidy = 5000;
        this.formData.annualSubsidy = 500;
        this.formData.zeroEmission = true;
        this.formData.dailyRange = 200;
        this.formData.urbanTime = 0.70;
        this.formData.workingDaysPerYear = 300;
        this.formData.rechargingAbility = 2;
        this.formData.rechargingFrequency = 70;
        this.formData.purchaseOption = 1;
        this.formData.term = 7;
        this.formData.interestRate = 0.10;
        this.formData.upfrontPayment = 0.30;

        this.charts = {
            annualCosts: {
                data: [[0, 0, 0], [0, 0, 0]],
                labels: [0, 1, 2]
            }
        };

        this.updateSummary();
    }

    updateSummary() {
        let chargeAnnualCost = getChargeAnnualCosts(this.formData);

        this.charts.annualCosts = {
            data: [
                chargeAnnualCost
            ],
            labels: _.range(chargeAnnualCost.length)
        }
    }
}

CalculatorController.$inject = ['$scope'];