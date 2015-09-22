import Country from './country';
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

        /** @member {Number} CalculatorFormData#truckWeight */
        this.truckWeight = 0;

        /** @member {?Country} CalculatorFormData#country */
        this.country = null;

        /** @member {Number} CalculatorFormData#dieselPrice */
        this.dieselPrice = 0;

        /** @member {Number} CalculatorFormData#electricityPrice */
        this.electricityPrice = 0;

        /** @member {Number} CalculatorFormData#oneTimeSubsidy */
        this.oneTimeSubsidy = 0;

        /** @member {Number} CalculatorFormData#annualSubsidy */
        this.annualSubsidy = 0;

        /** @member {boolean} CalculatorFormData#zeroEmission */
        this.zeroEmission = 0;

        /** @member {Number} CalculatorFormData#dailyRange */
        this.dailyRange = 0;

        /** @member {Number} CalculatorFormData#urbanTime */
        this.urbanTime = 0;

        /** @member {Number} CalculatorFormData#workingDaysPerYear */
        this.workingDaysPerYear = 0;

        /** @member {RechargingAbility} CalculatorFormData#rechargingAbility */
        this.rechargingAbility = RechargingAbility.NO;

        /** @member {Number} CalculatorFormData#rechargingFrequency */
        this.rechargingFrequency = 0;

        /** @member {?PurchaseOptions} CalculatorFormData#purchaseOption */
        this.purchaseOption = null;

        /** @member {Number} CalculatorFormData#term */
        this.term = 0;

        /** @member {Number} CalculatorFormData#interestRate */
        this.interestRate = 0;

        /** @member {Number} CalculatorFormData#upfrontPayment */
        this.upfrontPayment = 0;
    }
}