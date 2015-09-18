function getChargeTruckCost(formData) {
    return 100000;
}

function getChargeAnnualCosts(formData) {
    var chargeTruckCost = getChargeTruckCost(formData);
}

export default class CalculatorController {
    constructor($scope) {
        this.countries = [
            { name: 'United Kingdom', code: 'uk' }
        ];

        this.chargeTruck = {
            name: 'Charge 6t 32 kWh'
        };

        this.analogueTruck = {
            name: 'Isuzu NPR 6t'
        };

        this.formData = {
            vehicleType: 1,
            truckWeight: 5.5,
            country: this.countries[0],
            dieselPrice: 1.1,
            electricityPrice: 10.5,
            oneTimeSubsidy: 5000,
            annualSubsidy: 500,
            zeroEmission: true,
            dailyRange: 200,
            urbanTime: 70,
            workingDaysPerYear: 300,
            rechargingAbility: 2,
            rechargingFrequency: 70,
            purchaseOption: 1,
            term: 7,
            interestRate: 10,
            upfrontPayment: 30
        };

        this.charts = {
            annualCosts: {
                data: [[0, 0, 0], [0, 0, 0]],
                labels: [0, 0, 0]
            }
        };

        $scope.$watchCollection('formData', () => {
            this.charts.annualCosts = {
                data: [
                    getChargeAnnualCosts(this.formData),
                labels: {}
            }
        });
    }
}

CalculatorController.$inject = ['$scope'];