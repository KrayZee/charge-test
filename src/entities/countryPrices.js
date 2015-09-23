/**
 * @class Country
 */
export default class CountryPrices {
    /**
     * @param {string} name
     * @param {string} code
     */
    constructor(name, code) {
        /** @member {string} CountryPrices#name */
        this.name = name;

        /** @member {string} CountryPrices#code */
        this.code = code;

        /** @member {double|undefined} CountryPrices#dieselPrice */
        this.dieselPrice = 0;

        /** @member {double|undefined} CountryPrices#electricityPrice */
        this.electricityPrice = 0;

        /** @member {double|undefined} CountryPrices#oneTimeSubsidy */
        this.oneTimeSubsidy = 0;

        /** @member {double|undefined} CountryPrices#annualSubsidy */
        this.annualSubsidy = 0;
    }
}
