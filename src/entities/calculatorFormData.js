import CountryPrices from './countryPrices';
import VehicleType from './vehicleType';
import RechargingAbility from './rechargingAbility';
import PurchaseOptions from './purchaseOptions';

/**
 * @class CalculatorFormData
 */
export default class CalculatorFormData {
    constructor() {
        /** @member {?VehicleType} CalculatorFormData#vehicleType */
        this.vehicleType = null;

        /** @member {double} CalculatorFormData#truckWeight */
        this.truckWeight = 0;

        /** @member {?CountryPrices} CalculatorFormData#country */
        this.country = null;

        /** @member {boolean} CalculatorFormData#zeroEmission */
        this.zeroEmission = false;

        /** @member {double} CalculatorFormData#dailyRange */
        this.dailyRange = 0;

        /** @member {int} CalculatorFormData#urbanTime */
        this.urbanTime = 0;

        /** @member {int} CalculatorFormData#workingDaysPerYear */
        this.workingDaysPerYear = 0;

        /** @member {RechargingAbility} CalculatorFormData#rechargingAbility */
        this.rechargingAbility = RechargingAbility.NO;

        /** @member {double} CalculatorFormData#rechargingFrequency */
        this.rechargingFrequency = 0;

        /** @member {PurchaseOptions} CalculatorFormData#purchaseOption */
        this.purchaseOption = PurchaseOptions.ONE_TIME_PAYMENT;

        /** @member {int|undefined} CalculatorFormData#term */
        this.term = 0;

        /** @member {int|undefined} CalculatorFormData#interestRate */
        this.interestRate = 0;

        /** @member {int|undefined} CalculatorFormData#upfrontPayment */
        this.upfrontPayment = 0;
    }
}