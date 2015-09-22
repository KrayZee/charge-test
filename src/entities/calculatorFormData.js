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
        this.vehicleType = undefined;

        /** @member {double|undefined} CalculatorFormData#truckWeight */
        this.truckWeight = 0;

        /** @member {?Country} CalculatorFormData#country */
        this.country = undefined;

        /** @member {double|undefined} CalculatorFormData#dieselPrice */
        this.dieselPrice = 0;

        /** @member {double|undefined} CalculatorFormData#electricityPrice */
        this.electricityPrice = 0;

        /** @member {double|undefined} CalculatorFormData#oneTimeSubsidy */
        this.oneTimeSubsidy = 0;

        /** @member {double|undefined} CalculatorFormData#annualSubsidy */
        this.annualSubsidy = 0;

        /** @member {boolean} CalculatorFormData#zeroEmission */
        this.zeroEmission = false;

        /** @member {double|undefined} CalculatorFormData#dailyRange */
        this.dailyRange = 0;

        /** @member {int|undefined} CalculatorFormData#urbanTime */
        this.urbanTime = 0;

        /** @member {int|undefined} CalculatorFormData#workingDaysPerYear */
        this.workingDaysPerYear = 0;

        /** @member {RechargingAbility} CalculatorFormData#rechargingAbility */
        this.rechargingAbility = RechargingAbility.NO;

        /** @member {double|undefined} CalculatorFormData#rechargingFrequency */
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