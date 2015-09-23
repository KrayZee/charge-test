import _ from 'lodash';
import Color from 'color';

import CalculatorFormData from '../../entities/calculatorFormData';
import CalculatorSummary from '../../entities/calculatorSummary';
import CountryPrices from '../../entities/countryPrices';
import VehicleType from '../../entities/vehicleType';
import RechargingAbility from '../../entities/rechargingAbility';
import PurchaseOptions from '../../entities/purchaseOptions';
import Truck from '../../entities/truck';

import CalculationsService from '../../services/calculations';

var CURRENT_YEAR = new Date().getFullYear();

var ICE_COLOR = new Color('#bfbfbf');
var CHARGE_COLOR = new Color('#ed7d31');

var lastZeroEmission, lastDailyRange;

export default class CalculatorController {
    constructor($filter, $http, $q, objectsStorage) {
        this.$http = $http;
        this.$q = $q;
        this.objectsStorage = objectsStorage;

        this.chargeTruck = new Truck('Charge 6t 32 kWh', 0, 0);
        this.analogueTruck = new Truck('Isuzu NPR 6t', 0, 0);

        this.formData = new CalculatorFormData();
        this.summary = new CalculatorSummary();

        // will be used in chart tooltip templates
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
            /** @namespace response.data.truckCost */
            this.chargeTruck.cost = response.data.truckCost;
            this.chargeTruck.pol = response.data.pol;
        });
    }
}

CalculatorController.prototype.updateSummary = _.debounce(function() {
    if (this.formData.vehicleType === undefined) return;
    if (!this.formData.truckWeight) return;
    if (!this.formData.countryPrices) return;
    if (!this.formData.dailyRange) return;

    if (this.formData.purchaseOption == PurchaseOptions.LEASING) {
        if (this.formData.term === undefined) return;
        if (this.formData.interestRate === undefined) return;
        if (this.formData.upfrontPayment === undefined) return;
    }

    this.updateChargeTruckInfo().then(() => {
        let analogueAnnualCosts = CalculationsService.calculateAnalogueAnnualCosts(this.formData);
        let chargeAnnualCosts = CalculationsService.calculateChargeAnnualCosts(this.formData, this.chargeTruck);
        let savings = CalculationsService.calculateSavings(analogueAnnualCosts, chargeAnnualCosts);

        this.charts.annualCosts.data[0] = analogueAnnualCosts.map(amount => amount / 1000);
        this.charts.annualCosts.data[1] = chargeAnnualCosts.map(amount => amount / 1000);
        this.charts.annualCosts.labels = _.range(chargeAnnualCosts.length);

        this.charts.savings.data[0] = savings.map(amount => amount / 1000);
        this.charts.savings.labels = _.range(chargeAnnualCosts.length - 1).concat(['Total']);

        this.summary.totalSaving = savings[savings.length - 1];
        this.summary.paybackPeriod = this.summary.totalSaving > 0
            ? Math.max(CalculationsService.calculatePaybackPeriod(chargeAnnualCosts, analogueAnnualCosts), 0) : 0;
    });
}, 300);

CalculatorController.$inject = ['$filter', '$http', '$q', 'objectsStorage'];