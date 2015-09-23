/**
 * @class Truck
 */
export default class Truck {
    /**
     * @param {string} name
     * @param {number} cost
     * @param {number} pol
     */
    constructor(name, cost, pol) {
        /** @member {string} Truck#name */
        this.name = name;

        /** @member {number} Truck#cost */
        this.cost = cost;

        /** @member {number} Truck#pol */
        this.pol = pol;
    }
}
