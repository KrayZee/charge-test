import _ from 'lodash';
import Color from 'color';

import Country from '../../entities/country';
import CalculatorFormData from '../../entities/calculatorFormData';
import VehicleType from '../../entities/vehicleType';
import RechargingAbility from '../../entities/rechargingAbility';
import PurchaseOptions from '../../entities/purchaseOptions';

var CURRENT_YEAR = new Date().getFullYear();

var ICE_COLOR = new Color('#bfbfbf');
var CHARGE_COLOR = new Color('#ed7d31');

/**
 * @param {CalculatorFormData} formData
 * @returns {number}
 */
function getChargeTruckCost(formData) {
    // TODO: implements charge truck costs calculating
    return 80000;
}

/**
 * @param {CalculatorFormData} formData
 * @returns {number}
 */
function getChargePOL(formData) {
    // TODO: implements charge truck POL calculating
    return getChargeTruckCost(formData) * 0.005;
}

/**
 * @param {number} truckCost
 * @param {number} upfrontPayment
 * @param {number} term
 * @param {number} interestRate
 * @returns {number}
 */
function getLeasingYearPayment(truckCost, upfrontPayment, term, interestRate) {
    // calculate leasing year payment as annuity payment
    // https://en.wikipedia.org/wiki/Annuity

    let k = Math.sqrt(1 + interestRate);
    let kn = Math.pow(k, term);
    return truckCost * (1 - upfrontPayment) * kn * (k - 1) / (kn - 1);
}

/**
 * @param {CalculatorFormData} formData
 * @returns {number[]}
 */
function getChargeAnnualCosts(formData) {
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

function getAnalogueAnnualCost(formData) {
    var truckCost = 6000;
    var polCost = truckCost * 2;
    var costs = new Array(formData.term + 1);

    costs.fill(polCost);
    costs[0] = costs[0] + truckCost;
    return costs;
}

export default class CalculatorController {
    constructor() {
        this.countries = [
            new Country('United Kingdom', 'uk')
        ];

        this.chargeTruck = {
            name: 'Charge 6t 32 kWh'
        };

        this.analogueTruck = {
            name: 'Isuzu NPR 6t'
        };

        this.summary = {};

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
        this.formData.upfrontPayment = 0.45;

        this.charts = {
            annualCosts: {
                data: [
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                labels: [0, 1, 2],
                series: ['I.C.E.', 'Charge'],
                colours: [
                    {
                        fillColor: ICE_COLOR.hexString(),
                        highlightFill: ICE_COLOR.lighten(0.15).hexString()
                    },
                    {
                        fillColor: CHARGE_COLOR.hexString(),
                        highlightFill: CHARGE_COLOR.lighten(0.15).hexString()
                    }
                ],
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            },
            savings: {
                data: [
                    [0, 0, 0],
                    [0, 0, 0]
                ],
                labels: [0, 1, 2],
                series: ['I.C.E.', 'Charge'],
                colours: [
                    {
                        fillColor: ICE_COLOR.hexString(),
                        highlightFill: ICE_COLOR.lighten(0.15).hexString()
                    },
                    {
                        fillColor: CHARGE_COLOR.hexString(),
                        highlightFill: CHARGE_COLOR.lighten(0.15).hexString()
                    }
                ]
            }
        };

        setTimeout(() => this.updateSummary(), 0);
    }

    updateSummary() {
        if (this.formData.term === null) return;
        if (this.formData.purchaseOption === null) return;
        if (this.formData.upfrontPayment === null) return;

        let analogueAnnualCost = getAnalogueAnnualCost(this.formData);
        let chargeAnnualCost = getChargeAnnualCosts(this.formData);

        this.charts.annualCosts.data[0] = analogueAnnualCost.map(amount => amount / 1000);
        this.charts.annualCosts.data[1] = chargeAnnualCost.map(amount => amount / 1000);
        this.charts.annualCosts.labels = _.range(chargeAnnualCost.length);

        this.summary.paybackPeriod =
            Math.max((chargeAnnualCost[0] - analogueAnnualCost[0]) / (analogueAnnualCost[1] - chargeAnnualCost[1]), 0);
    }
}