export default class CalculatorController {
    constructor() {
        this.countries = [
            { name: 'United Kingdom', code: 'uk' }
        ];

        this.chargeTruck = {
            name: 'Charge 6t 32 kWh'
        };

        this.analogueTruck = {
            name: 'Isuzu NPR 6t'
        };
    }
}

CalculatorController.$inject = [];