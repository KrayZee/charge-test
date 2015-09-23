import _ from 'lodash';
import Color from 'color';

import CountryPrices from '../../entities/countryPrices';
import CalculatorFormData from '../../entities/calculatorFormData';
import VehicleType from '../../entities/vehicleType';
import RechargingAbility from '../../entities/rechargingAbility';
import PurchaseOptions from '../../entities/purchaseOptions';

var CURRENT_YEAR = new Date().getFullYear();

var ICE_COLOR = new Color('#bfbfbf');
var CHARGE_COLOR = new Color('#ed7d31');

var lastZeroEmission, lastDailyRange;

/**
 * @param {{name: string, cost: number, pol: number}} truck
 * @returns {number}
 */
function getChargeTruckCost(truck) {
    return truck.cost;
}

/**
 * @param {{name: string, cost: number, pol: number}} truck
 * @returns {number}
 */
function getChargePOL(truck) {
    return truck.pol;
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
    if (interestRate === 0) {
        return truckCost * (1 - upfrontPayment) / term;
    }

    let k = Math.sqrt(1 + interestRate);
    let kn = Math.pow(k, term);
    return truckCost * (1 - upfrontPayment) * kn * (k - 1) / (kn - 1);
}

/**
 * @param {CalculatorFormData} formData
 * @param {{name: string, cost: number, pol: number}} truck
 * @returns {number[]}
 */
function getChargeAnnualCosts(formData, truck) {
    var truckCost = getChargeTruckCost(truck);
    var polCost = getChargePOL(truck);
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
    constructor($filter, $http, $q) {
        this.$http = $http;
        this.$q = $q;

        $http.get('/api/country-prices').then(response => {
            this.countryPrices = response.data.map(item => {
                let c = new CountryPrices(item.name, item.code);
                c.dieselPrice = item.dieselPrice;
                c.electricityPrice = item.electricityPrice;
                c.oneTimeSubsidy = item.oneTimeSubsidy;
                c.annualSubsidy = item.annualSubsidy;
                return c;
            })
        });

        this.chargeTruck = {
            name: 'Charge 6t 32 kWh',
            cost: 0,
            pol: 0
        };

        this.analogueTruck = {
            name: 'Isuzu NPR 6t',
            cost: 0,
            pol: 0
        };

        this.summary = {};
        this.formData = new CalculatorFormData();

        Number.prototype.toCurrency = function(symbol) {
            return symbol + $filter('floatingNumber')(this, 2);
        };


        this.charts = {
            annualCosts: {
                data: [[], []
                ],
                labels: [],
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
                    title: 'Annual costs',
                    scaleLabelY: 'Thousands $',
                    scaleLabelX: 'Years',
                    multiTooltipTemplate: "<%= (value * 1000).toCurrency('$ ') %>",
                    scaleFontFamily: "'Muli', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                }
            },
            savings: {
                data: [[]],
                labels: [],
                options: {
                    title: 'Savings',
                    scaleLabelY: 'Thousands $',
                    scaleLabelX: 'Years',
                    scaleFontFamily: "'Muli', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
                }
            }
        };

        setTimeout(() => this.updateSummary(), 0);
    }

    updateChargeTruckInfo() {
        if (this.formData.zeroEmission === lastZeroEmission && this.formData.dailyRange === lastDailyRange) {
            return this.$q.when();
        }

        lastZeroEmission = this.formData.zeroEmission;
        lastDailyRange = this.formData.dailyRange;

        let params = {
            zeroEmission: lastZeroEmission,
            dailyRange: lastDailyRange
        };

        return this.$http.get('/api/charge-truck', { params: params }).then(response => {
            this.chargeTruck.cost = response.data.truckCost;
            this.chargeTruck.pol = response.data.pol;
        });
    }
}

CalculatorController.prototype.updateSummary = _.debounce(function() {
    if (this.formData.vehicleType === undefined) return;
    if (!this.formData.truckWeight) return;
    if (!this.formData.country) return;
    if (!this.formData.dailyRange) return;

    if (this.formData.purchaseOption == PurchaseOptions.LEASING) {
        if (this.formData.term === undefined) return;
        if (this.formData.interestRate === undefined) return;
        if (this.formData.upfrontPayment === undefined) return;
    }

    this.updateChargeTruckInfo().then(() => {
        let analogueAnnualCost = getAnalogueAnnualCost(this.formData);
        let chargeAnnualCost = getChargeAnnualCosts(this.formData, this.chargeTruck);
        let savings = [];

        analogueAnnualCost.forEach((amount, index) => {
            savings[index] = analogueAnnualCost[index] - chargeAnnualCost[index];

            if (index === 0) return;
            savings[index] = savings[index - 1] + savings[index];
        });

        this.charts.annualCosts.data[0] = analogueAnnualCost.map(amount => amount / 1000);
        this.charts.annualCosts.data[1] = chargeAnnualCost.map(amount => amount / 1000);
        this.charts.annualCosts.labels = _.range(chargeAnnualCost.length);

        this.charts.savings.data[0] = savings.concat([savings[savings.length - 1]]).map(amount => amount / 1000);
        this.charts.savings.labels = _.range(chargeAnnualCost.length).concat(['Total']);

        this.summary.totalSaving = savings[savings.length - 1];
        this.summary.paybackPeriod = this.summary.totalSaving > 0
            ? Math.max((chargeAnnualCost[0] - analogueAnnualCost[0]) / (analogueAnnualCost[1] - chargeAnnualCost[1]), 0)
            : 0;


    });
}, 300);

CalculatorController.$inject = ['$filter', '$http', '$q'];